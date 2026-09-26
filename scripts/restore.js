'use strict';
// Restores a SEVENCARGO data backup (downloaded from Admin → My account → Download backup)
// into the database in DATABASE_URL. Usage:
//   DATABASE_URL=postgres://... node scripts/restore.js path/to/sevencargo-backup.json
// WARNING: it replaces all current data in the target database.
const fs = require('fs');
const { pool, migrate } = require('../db');

const ORDER = ['settings', 'users', 'drivers', 'attendance', 'files', 'orders', 'order_events', 'messages', 'complaints', 'ratings', 'notifications'];

(async () => {
  const file = process.argv[2];
  if (!file) { console.error('Usage: node scripts/restore.js <backup.json>'); process.exit(1); }
  const backup = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (backup.app !== 'sevencargo') throw new Error('Not a SEVENCARGO backup file');
  await migrate(); // create tables / columns if the database is new
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`TRUNCATE ${[...ORDER].reverse().join(', ')} RESTART IDENTITY CASCADE`);
    for (const t of ORDER) {
      const rows = (backup.tables && backup.tables[t]) || [];
      const { rows: cols } = await client.query(
        `SELECT column_name, data_type FROM information_schema.columns WHERE table_name=$1`, [t]);
      const types = Object.fromEntries(cols.map((c) => [c.column_name, c.data_type]));
      for (const r of rows) {
        const keys = Object.keys(r).filter((k) => k in types);
        const vals = keys.map((k) => {
          const v = r[k];
          if (v && typeof v === 'object' && v.$b64 !== undefined) return Buffer.from(v.$b64, 'base64');
          if (types[k] === 'jsonb' || types[k] === 'json') return v == null ? null : JSON.stringify(v);
          return v;
        });
        await client.query(
          `INSERT INTO ${t} (${keys.map((k) => `"${k}"`).join(',')}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(',')})`, vals);
      }
      // move serial counters past the restored ids
      if (types.id && types.id === 'integer') {
        await client.query(`SELECT setval(pg_get_serial_sequence('${t}','id'), GREATEST(coalesce((SELECT max(id) FROM ${t}),0),1), (SELECT count(*)>0 FROM ${t}))`);
      }
      console.log(`${t}: ${rows.length} rows`);
    }
    await client.query('COMMIT');
    console.log('Restore complete.');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Restore failed, nothing was changed:', e.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
})();
