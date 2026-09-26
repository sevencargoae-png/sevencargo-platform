'use strict';
const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const { q, getSettings, EMIRATES, DEFAULT_SETTINGS } = require('../db');
const H = require('../lib/helpers');
const O = require('../lib/orders');
const rt = require('../lib/realtime');

const router = express.Router();
const { wrap, bad, HttpError, requireAdmin, requireSuperAdmin } = H;

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { error: 'too_many_attempts' } });

// ---------- auth ----------
router.post('/login', loginLimiter, wrap(async (req, res) => {
  const username = H.str((req.body || {}).username, { min: 1, max: 60, name: 'username' }).toLowerCase();
  const password = String((req.body || {}).password || '');
  const { rows } = await q('SELECT * FROM users WHERE lower(username)=$1', [username]);
  const u = rows[0];
  if (!u || !u.active || !(await bcrypt.compare(password, u.password_hash))) throw new HttpError(401, 'invalid_credentials');
  H.setAuthCookie(res, H.COOKIES.admin, H.signToken({ t: 'admin', id: u.id, tv: u.token_version }));
  res.json({ id: u.id, username: u.username, name: u.name, role: u.role });
}));
router.post('/logout', (req, res) => { H.clearAuthCookie(res, H.COOKIES.admin); res.json({ ok: true }); });

router.use(requireAdmin);
const actor = (req) => ({ type: 'admin', id: req.admin.id, name: req.admin.name });

router.get('/me', (req, res) => res.json(req.admin));

router.post('/me/password', wrap(async (req, res) => {
  const { current, next } = req.body || {};
  if (!next || String(next).length < 8) throw bad('weak_password');
  const { rows } = await q('SELECT password_hash FROM users WHERE id=$1', [req.admin.id]);
  if (!(await bcrypt.compare(String(current || ''), rows[0].password_hash))) throw bad('wrong_password');
  await q('UPDATE users SET password_hash=$1, token_version=token_version+1 WHERE id=$2', [await bcrypt.hash(String(next), 10), req.admin.id]);
  H.clearAuthCookie(res, H.COOKIES.admin);
  res.json({ ok: true });
}));

// ---------- dashboard ----------
router.get('/stats', wrap(async (req, res) => {
  const { rows: [s] } = await q(`
    SELECT
      count(*) FILTER (WHERE status='pending') AS pending,
      count(*) FILTER (WHERE status='assigned') AS assigned,
      count(*) FILTER (WHERE status IN ('accepted','picked_up')) AS in_progress,
      count(*) FILTER (WHERE status='delivered' AND delivered_at::date = (now() AT TIME ZONE 'Asia/Dubai')::date) AS delivered_today,
      count(*) FILTER (WHERE status='failed') AS failed,
      count(*) FILTER (WHERE created_at > now() - interval '24 hours' AND status<>'awaiting_payment') AS last24,
      coalesce(sum(amount) FILTER (WHERE status='delivered' AND delivered_at > date_trunc('month', now())),0) AS revenue_month,
      count(*) FILTER (WHERE flagged AND status NOT IN ('cancelled')) AS flagged
    FROM orders`);
  const { rows: [d] } = await q(`SELECT count(*) FILTER (WHERE active) AS total, count(*) FILTER (WHERE active AND duty_status='available') AS on_duty FROM drivers`);
  const { rows: [c] } = await q(`SELECT count(*) FILTER (WHERE status<>'resolved') AS open FROM complaints`);
  const { rows: [r] } = await q(`SELECT round(avg(stars)::numeric,2) AS avg, count(*) AS n FROM ratings`);
  const { rows: [cash] } = await q(`SELECT coalesce(sum(cash_collected),0) AS unsettled FROM orders WHERE cash_collected>0 AND NOT cash_settled`);
  const { rows: byEmirate } = await q(`SELECT pickup_emirate AS emirate, count(*)::int AS n FROM orders WHERE created_at > now() - interval '30 days' AND status<>'awaiting_payment' GROUP BY 1 ORDER BY 2 DESC`);
  const toN = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v == null ? 0 : Number(v)]));
  res.json({ orders: toN(s), drivers: toN(d), complaints: toN(c), ratings: toN(r), cash: toN(cash), by_emirate: byEmirate });
}));

// ---------- orders ----------
router.get('/orders', wrap(async (req, res) => {
  const where = []; const p = [];
  const status = String(req.query.status || '');
  if (status === 'active') where.push(`o.status IN ('pending','assigned','accepted','picked_up')`);
  else if (status === 'flagged') where.push('o.flagged');
  else if (status) { p.push(status); where.push(`o.status=$${p.length}`); }
  else where.push(`o.status<>'awaiting_payment'`);
  if (req.query.emirate) { p.push(String(req.query.emirate)); where.push(`o.pickup_emirate=$${p.length}`); }
  if (req.query.driver_id) { p.push(Number(req.query.driver_id)); where.push(`o.driver_id=$${p.length}`); }
  if (req.query.q) {
    const s = String(req.query.q).trim();
    p.push('%' + s.replace(/[%_]/g, '') + '%');
    where.push(`(o.tracking_no ILIKE $${p.length} OR o.sender_phone ILIKE $${p.length} OR o.receiver_phone ILIKE $${p.length} OR o.sender_name ILIKE $${p.length} OR o.receiver_name ILIKE $${p.length})`);
  }
  const limit = Math.min(100, Number(req.query.limit) || 50);
  const offset = Math.max(0, Number(req.query.offset) || 0);
  p.push(limit, offset);
  const { rows } = await q(
    `SELECT o.id, o.tracking_no, o.status, o.payment_method, o.payment_status, o.amount, o.price_pending, (o.pickup_lat IS NULL OR o.dropoff_lat IS NULL) AS needs_location, o.pickup_emirate, o.dropoff_emirate,
            o.sender_name, o.sender_phone, o.receiver_name, o.receiver_phone, o.distance_km, o.weight_kg, o.flagged,
            o.created_at, o.updated_at, o.driver_id, d.name AS driver_name, count(*) OVER() AS total
       FROM orders o LEFT JOIN drivers d ON d.id=o.driver_id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY o.created_at DESC LIMIT $${p.length - 1} OFFSET $${p.length}`, p
  );
  res.json({ total: rows[0] ? Number(rows[0].total) : 0, orders: rows.map(({ total, ...r }) => ({ ...r, amount: Number(r.amount) })) });
}));

router.get('/orders/:id', wrap(async (req, res) => {
  const o = await O.getOrder(Number(req.params.id));
  if (!o) throw new HttpError(404, 'not_found');
  res.json({ order: O.forAdmin(o), events: await O.getEvents(o.id, true), messages: await O.getMessages(o.id) });
}));

router.post('/orders/:id/assign', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const driverId = H.num((req.body || {}).driver_id, { min: 1, name: 'driver' });
  const force = (req.body || {}).force === true;
  const o = await O.getOrder(id);
  if (!o) throw new HttpError(404, 'not_found');
  if (!['pending', 'assigned', 'failed'].includes(o.status)) throw bad('cannot_assign_in_status');
  const { rows: [d] } = await q('SELECT * FROM drivers WHERE id=$1', [driverId]);
  if (!d || !d.active) throw bad('driver_not_found');
  if (d.duty_status !== 'available' && !force) throw bad('driver_not_on_duty');
  if (d.emirate !== o.pickup_emirate && !force) throw bad('driver_other_emirate');
  const prev = o.driver_id;
  const { rows } = await q(
    `UPDATE orders SET driver_id=$1, status='assigned', assigned_at=now(), accepted_at=NULL, updated_at=now()
      WHERE id=$2 AND status IN ('pending','assigned','failed') RETURNING *`, [driverId, id]
  );
  if (!rows[0]) throw bad('cannot_assign_in_status');
  if (prev && prev !== driverId) {
    await O.addEvent(id, 'reassigned', actor(req), `From driver #${prev}`);
    await rt.notifyDriver(prev, 'order_unassigned', 'Order reassigned', o.tracking_no, id);
    rt.getIO() && rt.getIO().to('driver:' + prev).emit('order-changed', { id });
  }
  await O.addEvent(id, 'assigned', actor(req), `Driver: ${d.name}`);
  await rt.notifyDriver(driverId, 'order_assigned', 'New order assigned', `${o.tracking_no} — ${o.pickup_address}`, id);
  rt.orderChanged(rows[0]);
  res.json({ ok: true });
}));

const ADMIN_STATUSES = ['pending', 'assigned', 'accepted', 'picked_up', 'delivered', 'failed', 'cancelled'];
router.post('/orders/:id/status', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const status = String((req.body || {}).status || '');
  const note = H.str((req.body || {}).note, { max: 500, name: 'note' });
  if (!ADMIN_STATUSES.includes(status)) throw bad('invalid_status');
  const o = await O.getOrder(id);
  if (!o) throw new HttpError(404, 'not_found');
  if (['delivered', 'cancelled'].includes(o.status) && status !== o.status) {
    if (!note) throw bad('note_required_for_reopen');
  }
  if (['assigned', 'accepted', 'picked_up'].includes(status) && !o.driver_id) throw bad('assign_driver_first');
  const sets = ['status=$1', 'updated_at=now()'];
  if (status === 'delivered') sets.push('delivered_at=now()');
  if (status === 'picked_up') sets.push('picked_up_at=coalesce(picked_up_at, now())');
  if (status === 'accepted') sets.push('accepted_at=coalesce(accepted_at, now())');
  if (status === 'cancelled') sets.push('cancelled_at=now()');
  if (status === 'failed') sets.push('fail_reason=$3');
  if (status === 'pending') sets.push('driver_id=NULL', 'assigned_at=NULL', 'accepted_at=NULL');
  const params = [status, id]; if (status === 'failed') params.push(note || 'Marked failed by admin');
  const { rows } = await q(`UPDATE orders SET ${sets.join(', ')} WHERE id=$2 RETURNING *`, params);
  await O.addEvent(id, status, actor(req), note || 'Status changed by admin');
  if (o.driver_id && o.driver_id !== rows[0].driver_id) rt.getIO() && rt.getIO().to('driver:' + o.driver_id).emit('order-changed', { id });
  if (rows[0].driver_id) await rt.notifyDriver(rows[0].driver_id, 'order_status', `Order ${o.tracking_no}: ${status}`, note || '', id);
  rt.orderChanged(rows[0]);
  res.json({ ok: true });
}));

// Operations completes/corrects an order: locations (link or lat,lng), areas, names, receiver phone, price.
router.post('/orders/:id/details', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const b = req.body || {};
  const o = await O.getOrder(id);
  if (!o) throw new HttpError(404, 'not_found');
  const sets = []; const params = [id]; const changed = [];
  const put = (col, v, label) => { params.push(v); sets.push(`${col}=$${params.length}`); changed.push(label || col); };
  const txt = (k, max) => { if (b[k] !== undefined) put(k, H.str(b[k], { max, name: k }) || (k.endsWith('_area') ? '' : null)); };
  for (const side of ['pickup', 'dropoff']) {
    if (b[side + '_emirate'] !== undefined) put(side + '_emirate', b[side + '_emirate'] ? H.emirateCode(b[side + '_emirate']) : null);
    txt(side + '_area', 120); txt(side + '_address', 300);
    if (b[side + '_location'] !== undefined) {
      if (b[side + '_location'] === '' || b[side + '_location'] === null) { put(side + '_lat', null, side + '_location'); put(side + '_lng', null, side + '_location'); }
      else { const c = await H.parseLocation(b[side + '_location']); put(side + '_lat', c.lat, side + '_location'); put(side + '_lng', c.lng, side + '_location'); }
    }
  }
  txt('sender_name', 80); txt('receiver_name', 80);
  if (b.receiver_phone !== undefined) put('receiver_phone', String(b.receiver_phone || '').trim() ? H.phone(b.receiver_phone, 'receiver_phone') : null);
  if (b.amount !== undefined && b.amount !== '' && b.amount !== null) {
    if (o.payment_status === 'paid') throw bad('already_paid');
    const amount = H.num(b.amount, { min: 0, max: 100000, name: 'amount' });
    put('amount', amount); put('price_pending', false, 'price'); put('price_estimated', false, 'price');
    params.push(JSON.stringify({ ...(o.price_breakdown || {}), pending: false, manual: true, total: amount })); sets.push(`price_breakdown=$${params.length}`);
  }
  if (!sets.length) throw bad('nothing_to_update');
  const { rows } = await q(`UPDATE orders SET ${sets.join(', ')}, updated_at=now() WHERE id=$1 RETURNING *`, params);
  await O.addEvent(id, 'note', actor(req), 'Order details updated: ' + [...new Set(changed)].join(', '));
  if (rows[0].driver_id) {
    await rt.notifyDriver(rows[0].driver_id, 'order_status', `Order ${o.tracking_no} updated`, [...new Set(changed)].join(', '), id);
    rt.getIO() && rt.getIO().to('driver:' + rows[0].driver_id).emit('order-changed', { id });
  }
  rt.orderChanged(rows[0]);
  res.json({ ok: true });
}));

router.post('/orders/:id/mark-paid', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const note = H.str((req.body || {}).note, { min: 3, max: 300, name: 'note' });
  const { rows } = await q(`UPDATE orders SET payment_status='paid', status=CASE WHEN status='awaiting_payment' THEN 'pending' ELSE status END, updated_at=now()
                            WHERE id=$1 AND payment_status<>'paid' RETURNING *`, [id]);
  if (!rows[0]) throw bad('already_paid');
  await O.addEvent(id, 'paid', actor(req), note);
  rt.orderChanged(rows[0]);
  res.json({ ok: true });
}));

router.post('/orders/:id/notes', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const notes = H.str((req.body || {}).admin_notes, { max: 2000, name: 'notes' });
  await q('UPDATE orders SET admin_notes=$1, updated_at=now() WHERE id=$2', [notes, id]);
  res.json({ ok: true });
}));

router.post('/orders/:id/unflag', wrap(async (req, res) => {
  const id = Number(req.params.id);
  await q('UPDATE orders SET flagged=false, updated_at=now() WHERE id=$1', [id]);
  await O.addEvent(id, 'note', actor(req), 'Flag reviewed and cleared');
  res.json({ ok: true });
}));

router.post('/orders/:id/messages', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const body = H.str((req.body || {}).body, { min: 1, max: 1000, name: 'message' });
  const o = await O.getOrder(id);
  if (!o) throw new HttpError(404, 'not_found');
  const { rows } = await q('INSERT INTO messages(order_id, sender_type, sender_name, body) VALUES ($1,$2,$3,$4) RETURNING *', [id, 'admin', req.admin.name, body]);
  rt.chatMessage(rows[0], o.driver_id);
  if (o.driver_id) await rt.notifyDriver(o.driver_id, 'chat', `Message on ${o.tracking_no}`, body.slice(0, 80), id);
  res.status(201).json(rows[0]);
}));

// ---------- drivers ----------
router.get('/drivers', wrap(async (req, res) => {
  const { rows } = await q(`
    SELECT d.id, d.name, d.phone, d.emirate, d.route_areas, d.vehicle_type, d.vehicle_plate, d.license_no, d.notes, d.active,
           d.duty_status, d.checked_in_at, d.last_lat, d.last_lng, d.last_loc_at, d.created_at,
           (SELECT count(*)::int FROM orders o WHERE o.driver_id=d.id AND o.status IN ('assigned','accepted','picked_up')) AS active_orders,
           (SELECT count(*)::int FROM orders o WHERE o.driver_id=d.id AND o.status='delivered') AS delivered,
           (SELECT round(avg(stars)::numeric,2) FROM ratings r WHERE r.driver_id=d.id) AS rating,
           (SELECT coalesce(sum(cash_collected),0) FROM orders o WHERE o.driver_id=d.id AND NOT o.cash_settled) AS cash_due
      FROM drivers d ORDER BY d.active DESC, d.emirate, d.name`);
  res.json(rows.map((r) => ({ ...r, rating: r.rating == null ? null : Number(r.rating), cash_due: Number(r.cash_due) })));
}));

function driverFields(b, partial = false) {
  const out = {};
  if (!partial || b.name !== undefined) out.name = H.str(b.name, { min: 2, max: 80, name: 'name' });
  if (!partial || b.phone !== undefined) out.phone = H.phone(b.phone);
  if (!partial || b.emirate !== undefined) out.emirate = H.emirateCode(b.emirate);
  for (const k of ['route_areas', 'vehicle_type', 'vehicle_plate', 'license_no', 'notes']) {
    if (!partial || b[k] !== undefined) out[k] = H.str(b[k], { max: k === 'route_areas' || k === 'notes' ? 1000 : 60, name: k });
  }
  if (b.active !== undefined) out.active = !!b.active;
  return out;
}

router.post('/drivers', wrap(async (req, res) => {
  const f = driverFields(req.body || {});
  const password = (req.body || {}).password ? String(req.body.password) : H.genPassword(8);
  if (password.length < 6) throw bad('weak_password');
  try {
    const { rows } = await q(
      `INSERT INTO drivers(name, phone, password_hash, emirate, route_areas, vehicle_type, vehicle_plate, license_no, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [f.name, f.phone, await bcrypt.hash(password, 10), f.emirate, f.route_areas, f.vehicle_type, f.vehicle_plate, f.license_no, f.notes]
    );
    res.status(201).json({ id: rows[0].id, password });
  } catch (e) { if (e.code === '23505') throw bad('phone_exists'); throw e; }
}));

router.put('/drivers/:id', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const f = driverFields(req.body || {}, true);
  const keys = Object.keys(f);
  if (!keys.length) throw bad('nothing_to_update');
  const sets = keys.map((k, i) => `${k}=$${i + 1}`);
  if (f.active === false) sets.push("duty_status='off'", 'token_version=token_version+1');
  try {
    await q(`UPDATE drivers SET ${sets.join(', ')} WHERE id=$${keys.length + 1}`, [...keys.map((k) => f[k]), id]);
  } catch (e) { if (e.code === '23505') throw bad('phone_exists'); throw e; }
  if (f.active === false) rt.getIO() && rt.getIO().to('driver:' + id).emit('force-logout');
  res.json({ ok: true });
}));

router.post('/drivers/:id/password', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const password = H.genPassword(8);
  await q('UPDATE drivers SET password_hash=$1, token_version=token_version+1 WHERE id=$2', [await bcrypt.hash(password, 10), id]);
  rt.getIO() && rt.getIO().to('driver:' + id).emit('force-logout');
  res.json({ password });
}));

router.post('/drivers/:id/duty', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const status = (req.body || {}).status === 'available' ? 'available' : 'off';
  const { rows: [d] } = await q('SELECT duty_status FROM drivers WHERE id=$1 AND active', [id]);
  if (!d) throw new HttpError(404, 'not_found');
  if (status === 'available' && d.duty_status !== 'available') {
    await q(`UPDATE drivers SET duty_status='available', checked_in_at=now() WHERE id=$1`, [id]);
    await q('INSERT INTO attendance(driver_id, by_admin) VALUES ($1, true)', [id]);
  } else if (status === 'off' && d.duty_status !== 'off') {
    await q(`UPDATE drivers SET duty_status='off' WHERE id=$1`, [id]);
    await q('UPDATE attendance SET check_out=now() WHERE driver_id=$1 AND check_out IS NULL', [id]);
  }
  rt.getIO() && rt.getIO().to('driver:' + id).emit('duty-changed', { status });
  rt.getIO() && rt.getIO().to('admins').emit('drivers-changed');
  res.json({ ok: true });
}));

router.get('/drivers/:id/attendance', wrap(async (req, res) => {
  const { rows } = await q('SELECT * FROM attendance WHERE driver_id=$1 ORDER BY check_in DESC LIMIT 60', [Number(req.params.id)]);
  res.json(rows);
}));

router.get('/drivers/:id/messages', wrap(async (req, res) => {
  const { rows } = await q('SELECT * FROM messages WHERE driver_id=$1 AND order_id IS NULL ORDER BY id ASC LIMIT 500', [Number(req.params.id)]);
  res.json(rows);
}));

router.post('/drivers/:id/messages', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const body = H.str((req.body || {}).body, { min: 1, max: 1000, name: 'message' });
  const { rows } = await q('INSERT INTO messages(driver_id, sender_type, sender_name, body) VALUES ($1,$2,$3,$4) RETURNING *', [id, 'admin', req.admin.name, body]);
  rt.chatMessage(rows[0]);
  await rt.notifyDriver(id, 'chat', 'Message from operations', body.slice(0, 80));
  res.status(201).json(rows[0]);
}));

router.get('/chats', wrap(async (req, res) => {
  const { rows } = await q(`
    SELECT d.id AS driver_id, d.name, d.emirate, d.duty_status, m.body, m.sender_type, m.created_at
      FROM drivers d
      LEFT JOIN LATERAL (SELECT body, sender_type, created_at FROM messages WHERE driver_id=d.id AND order_id IS NULL ORDER BY id DESC LIMIT 1) m ON true
     WHERE d.active ORDER BY m.created_at DESC NULLS LAST, d.name`);
  res.json(rows);
}));

// ---------- live map ----------
router.get('/live', wrap(async (req, res) => {
  const { rows: drivers } = await q(`SELECT id, name, emirate, duty_status, last_lat, last_lng, last_loc_at FROM drivers WHERE active AND last_lat IS NOT NULL`);
  const { rows: orders } = await q(`SELECT id, tracking_no, status, driver_id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng FROM orders WHERE status IN ('pending','assigned','accepted','picked_up')`);
  res.json({ drivers, orders });
}));

// ---------- cash ----------
router.get('/cash', wrap(async (req, res) => {
  const { rows } = await q(`
    SELECT o.id, o.tracking_no, o.cash_collected, o.payment_method, o.picked_up_at, o.delivered_at, o.driver_id, d.name AS driver_name
      FROM orders o JOIN drivers d ON d.id=o.driver_id
     WHERE o.cash_collected>0 AND NOT o.cash_settled ORDER BY d.name, o.id`);
  res.json(rows.map((r) => ({ ...r, cash_collected: Number(r.cash_collected) })));
}));
router.post('/drivers/:id/settle', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const { rows } = await q(`UPDATE orders SET cash_settled=true, cash_settled_at=now() WHERE driver_id=$1 AND cash_collected>0 AND NOT cash_settled RETURNING id, cash_collected`, [id]);
  for (const r of rows) await O.addEvent(r.id, 'cash_settled', actor(req), `AED ${r.cash_collected}`);
  res.json({ settled: rows.length, total: rows.reduce((a, r) => a + Number(r.cash_collected), 0) });
}));

// ---------- complaints & ratings ----------
router.get('/complaints', wrap(async (req, res) => {
  const p = []; const w = [];
  if (req.query.source) { p.push(String(req.query.source)); w.push(`c.source=$${p.length}`); }
  if (req.query.status) { p.push(String(req.query.status)); w.push(`c.status=$${p.length}`); }
  const { rows } = await q(`
    SELECT c.*, o.tracking_no, d.name AS driver_name FROM complaints c
      LEFT JOIN orders o ON o.id=c.order_id LEFT JOIN drivers d ON d.id=c.driver_id
     ${w.length ? 'WHERE ' + w.join(' AND ') : ''} ORDER BY (c.status='resolved'), c.created_at DESC LIMIT 200`, p);
  res.json(rows.map((c) => ({ ...c, photo_url: c.photo_id ? '/files/' + c.photo_id : null })));
}));
router.put('/complaints/:id', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const b = req.body || {};
  const status = ['open', 'in_progress', 'resolved'].includes(b.status) ? b.status : null;
  if (!status) throw bad('invalid_status');
  const reply = H.str(b.admin_reply, { max: 2000, name: 'reply' });
  const { rows } = await q('UPDATE complaints SET status=$1, admin_reply=$2, updated_at=now() WHERE id=$3 RETURNING *', [status, reply, id]);
  if (!rows[0]) throw new HttpError(404, 'not_found');
  if (rows[0].source === 'driver' && rows[0].driver_id) {
    await rt.notifyDriver(rows[0].driver_id, 'incident_update', `Report #${id}: ${status}`, reply.slice(0, 120));
  }
  res.json({ ok: true });
}));
router.get('/ratings', wrap(async (req, res) => {
  const { rows } = await q(`SELECT r.*, o.tracking_no, d.name AS driver_name FROM ratings r JOIN orders o ON o.id=r.order_id LEFT JOIN drivers d ON d.id=r.driver_id ORDER BY r.created_at DESC LIMIT 300`);
  res.json(rows);
}));

// ---------- notifications ----------
router.get('/notifications', wrap(async (req, res) => {
  const { rows } = await q(`SELECT * FROM notifications WHERE target='admin' ORDER BY id DESC LIMIT 50`);
  const { rows: [c] } = await q(`SELECT count(*)::int AS n FROM notifications WHERE target='admin' AND NOT read`);
  res.json({ unread: c.n, items: rows });
}));
router.post('/notifications/read', wrap(async (req, res) => {
  await q(`UPDATE notifications SET read=true WHERE target='admin' AND NOT read`);
  res.json({ ok: true });
}));

// ---------- settings ----------
router.get('/settings', wrap(async (req, res) => res.json(await getSettings())));
// Full data backup (super admin): JSON with every table; binary columns as base64. Restore with scripts/restore.js.
const BACKUP_TABLES = ['settings', 'users', 'drivers', 'attendance', 'files', 'orders', 'order_events', 'messages', 'complaints', 'ratings', 'notifications'];
router.get('/backup', requireSuperAdmin, wrap(async (req, res) => {
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="sevencargo-backup-${stamp}.json"`);
  res.setHeader('Cache-Control', 'no-store');
  res.write(`{"app":"sevencargo","format":1,"created_at":${JSON.stringify(new Date().toISOString())},"tables":{`);
  for (let i = 0; i < BACKUP_TABLES.length; i++) {
    const t = BACKUP_TABLES[i];
    res.write(`${i ? ',' : ''}${JSON.stringify(t)}:[`);
    let last = null; let first = true;
    // page through by ctid-free ordering to keep memory small (files can be large)
    const key = t === 'settings' ? 'key' : 'id';
    for (;;) {
      const { rows } = await q(`SELECT * FROM ${t} ${last === null ? '' : `WHERE ${key} > $1`} ORDER BY ${key} LIMIT 200`, last === null ? [] : [last]);
      for (const r of rows) {
        for (const [k, v] of Object.entries(r)) if (Buffer.isBuffer(v)) r[k] = { $b64: v.toString('base64') };
        res.write((first ? '' : ',') + JSON.stringify(r)); first = false;
      }
      if (rows.length < 200) break;
      last = rows[rows.length - 1][key];
    }
    res.write(']');
  }
  res.end('}}');
}));

router.put('/settings', requireSuperAdmin, wrap(async (req, res) => {
  const b = req.body || {};
  const cur = await getSettings();
  if (b.pricing) {
    const P = b.pricing; const out = { emirates: {} };
    for (const code of Object.keys(EMIRATES)) {
      const e = (P.emirates || {})[code] || cur.pricing.emirates[code];
      out.emirates[code] = { base: H.num(e.base, { min: 0, max: 10000, name: 'base_' + code }), active: e.active !== false };
    }
    for (const k of ['included_km', 'per_km', 'included_kg', 'per_kg', 'inter_emirate_fee', 'cod_fee', 'vat_percent', 'vol_divisor', 'min_price']) {
      out[k] = H.num(P[k] ?? cur.pricing[k], { min: 0, max: 100000, name: k });
    }
    if (out.vol_divisor < 1000) throw bad('invalid_vol_divisor');
    await q(`UPDATE settings SET value=$1, updated_at=now() WHERE key='pricing'`, [JSON.stringify(out)]);
  }
  if (b.limits) {
    const L = b.limits;
    const out = {
      max_weight_kg: H.num(L.max_weight_kg ?? cur.limits.max_weight_kg, { min: 1, max: 1000, name: 'max_weight' }),
      max_dim_cm: H.num(L.max_dim_cm ?? cur.limits.max_dim_cm, { min: 10, max: 1000, name: 'max_dim' }),
      geofence_m: H.num(L.geofence_m ?? cur.limits.geofence_m, { min: 50, max: 10000, name: 'geofence' }),
      require_delivery_photo: L.require_delivery_photo !== undefined ? !!L.require_delivery_photo : cur.limits.require_delivery_photo,
    };
    await q(`UPDATE settings SET value=$1, updated_at=now() WHERE key='limits'`, [JSON.stringify(out)]);
  }
  if (b.contact) {
    const wa = String(b.contact.whatsapp || '').replace(/\D/g, '');
    if (!/^\d{9,15}$/.test(wa)) throw bad('invalid_whatsapp');
    const out = { whatsapp: wa, whatsapp_display: H.str(b.contact.whatsapp_display, { max: 30, name: 'display' }), email: H.str(b.contact.email, { max: 120, name: 'email' }) };
    await q(`UPDATE settings SET value=$1, updated_at=now() WHERE key='contact'`, [JSON.stringify(out)]);
  }
  if (b.prohibited) {
    if (!Array.isArray(b.prohibited) || b.prohibited.length > 60) throw bad('invalid_prohibited');
    const out = b.prohibited.map((x) => ({ ar: H.str(x.ar, { min: 1, max: 200, name: 'item' }), en: H.str(x.en, { min: 1, max: 200, name: 'item' }) }));
    await q(`UPDATE settings SET value=$1, updated_at=now() WHERE key='prohibited'`, [JSON.stringify(out)]);
  }
  if (b.reset === true) {
    for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) await q('UPDATE settings SET value=$1 WHERE key=$2', [JSON.stringify(v), k]);
  }
  res.json(await getSettings());
}));

// ---------- staff users ----------
router.get('/users', requireSuperAdmin, wrap(async (req, res) => {
  const { rows } = await q('SELECT id, username, name, role, active, created_at FROM users ORDER BY id');
  res.json(rows);
}));
router.post('/users', requireSuperAdmin, wrap(async (req, res) => {
  const b = req.body || {};
  const username = H.str(b.username, { min: 3, max: 40, name: 'username' }).toLowerCase();
  if (!/^[a-z0-9._-]+$/.test(username)) throw bad('invalid_username');
  const name = H.str(b.name, { min: 2, max: 80, name: 'name' });
  const role = b.role === 'admin' ? 'admin' : 'staff';
  const password = H.genPassword(10);
  try {
    const { rows } = await q('INSERT INTO users(username, password_hash, name, role) VALUES ($1,$2,$3,$4) RETURNING id', [username, await bcrypt.hash(password, 10), name, role]);
    res.status(201).json({ id: rows[0].id, password });
  } catch (e) { if (e.code === '23505') throw bad('username_exists'); throw e; }
}));
router.put('/users/:id', requireSuperAdmin, wrap(async (req, res) => {
  const id = Number(req.params.id);
  if (id === req.admin.id) throw bad('cannot_edit_self');
  const b = req.body || {};
  const role = b.role === 'admin' ? 'admin' : 'staff';
  await q('UPDATE users SET role=$1, active=$2, token_version=token_version+1 WHERE id=$3', [role, b.active !== false, id]);
  res.json({ ok: true });
}));
router.post('/users/:id/password', requireSuperAdmin, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const password = H.genPassword(10);
  await q('UPDATE users SET password_hash=$1, token_version=token_version+1 WHERE id=$2', [await bcrypt.hash(password, 10), id]);
  res.json({ password });
}));

module.exports = router;
