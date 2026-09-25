'use strict';
const path = require('path');
const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const bcrypt = require('bcryptjs');
const { Server } = require('socket.io');

const db = require('./db');
const H = require('./lib/helpers');
const rt = require('./lib/realtime');
const pay = require('./lib/payments');
const { LIVE_STATUSES } = require('./lib/orders');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.disable('x-powered-by');

// Canonical host redirect (www -> apex) when CANONICAL_HOST is set
app.use((req, res, next) => {
  const canon = process.env.CANONICAL_HOST;
  if (canon && req.hostname && req.hostname !== canon && req.hostname === 'www.' + canon) {
    return res.redirect(301, `https://${canon}${req.originalUrl}`);
  }
  next();
});

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(self), camera=(self)');
  if (H.IS_PROD) res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  next();
});

// Stripe webhook needs the raw body — registered before the JSON parser
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), H.wrap(async (req, res) => {
  let event;
  try { event = pay.constructEvent(req.body, req.headers['stripe-signature']); } catch (e) { return res.status(400).send('bad signature'); }
  if (!event) return res.status(400).send('webhook not configured');
  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    await pay.markPaidFromSession(event.data.object);
  }
  res.json({ received: true });
}));

app.use(express.json({ limit: '8mb' }));
app.use(cookieParser());

app.get('/healthz', H.wrap(async (req, res) => { await db.q('SELECT 1'); res.json({ ok: true }); }));

app.use('/api', require('./routes/public'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/driver', require('./routes/driver'));

app.get('/files/:id', H.wrap(async (req, res) => {
  if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) return res.status(404).end();
  const { rows } = await db.q('SELECT mime, data FROM files WHERE id=$1', [req.params.id]);
  if (!rows[0]) return res.status(404).end();
  res.setHeader('Content-Type', rows[0].mime);
  res.setHeader('Cache-Control', 'private, max-age=86400');
  res.send(rows[0].data);
}));

// Pages (clean URLs)
const PUB = path.join(__dirname, 'public');
const PAGES = { '/': 'index.html', '/order': 'order.html', '/track': 'track.html', '/admin': 'admin.html', '/driver': 'driver.html', '/complaints': 'complaints.html', '/privacy': 'privacy.html', '/terms': 'terms.html', '/cookies': 'cookies.html' };
for (const [route, file] of Object.entries(PAGES)) {
  app.get(route, (req, res) => { res.setHeader('Cache-Control', 'no-cache'); res.sendFile(path.join(PUB, file)); });
}
app.use('/vendor/leaflet', express.static(path.join(__dirname, 'node_modules', 'leaflet', 'dist'), { maxAge: '7d' }));
app.use(express.static(PUB, { index: false, extensions: ['html'], maxAge: '1h' }));

app.use('/api', (req, res) => res.status(404).json({ error: 'not_found' }));
app.use((req, res) => res.status(404).sendFile(path.join(PUB, 'index.html')));

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'too_large' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'invalid_json' });
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  const body = { error: status >= 500 ? 'server_error' : (err.code || 'error') };
  if (err.meters != null) body.meters = err.meters;
  res.status(status).json(body);
});

// ---------- realtime ----------
const io = new Server(server, { cors: { origin: false }, maxHttpBufferSize: 1e5 });
rt.setIO(io);

io.on('connection', async (socket) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie || '');
  const role = socket.handshake.auth && socket.handshake.auth.role;
  let admin = null; let driver = null;
  try {
    if (role === 'admin') admin = await H.loadAdmin(cookies[H.COOKIES.admin]);
    if (role === 'driver') driver = await H.loadDriver(cookies[H.COOKIES.driver]);
  } catch (e) { console.error('socket auth', e.message); }
  const custIds = H.custOrders(cookies[H.COOKIES.cust]);

  if (admin) socket.join('admins');
  if (driver) socket.join('driver:' + driver.id);

  socket.on('join-order', (orderId) => {
    const id = Number(orderId);
    if (admin || custIds.includes(id)) socket.join('order:' + id);
  });
  socket.on('leave-order', (orderId) => socket.leave('order:' + Number(orderId)));

  let lastSaved = 0;
  socket.on('loc', async (p) => {
    if (!driver || !p) return;
    const lat = Number(p.lat), lng = Number(p.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return;
    const now = Date.now();
    if (now - lastSaved < 4000) return; // throttle
    lastSaved = now;
    try {
      const { rows: [d] } = await db.q(`UPDATE drivers SET last_lat=$1, last_lng=$2, last_loc_at=now() WHERE id=$3 AND active RETURNING duty_status`, [lat, lng, driver.id]);
      if (!d) return;
      const payload = { driver_id: driver.id, lat, lng, at: new Date().toISOString(), duty_status: d.duty_status };
      io.to('admins').emit('driver-loc', payload);
      const { rows } = await db.q(`SELECT id FROM orders WHERE driver_id=$1 AND status = ANY($2)`, [driver.id, LIVE_STATUSES]);
      for (const r of rows) io.to('order:' + r.id).emit('driver-loc', { lat, lng, at: payload.at });
    } catch (e) { console.error('loc', e.message); }
  });
});

// ---------- bootstrap ----------
async function ensureAdmin() {
  const { rows } = await db.q('SELECT count(*)::int AS n FROM users');
  if (rows[0].n > 0) return;
  const username = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 8) { console.warn('No users exist and ADMIN_PASSWORD is not set (min 8 chars) — admin not created'); return; }
  await db.q('INSERT INTO users(username, password_hash, name, role) VALUES ($1,$2,$3,$4)', [username, await bcrypt.hash(password, 10), 'Administrator', 'admin']);
  console.log('Initial admin user created:', username);
}

(async () => {
  await db.migrate();
  await ensureAdmin();
  server.listen(PORT, () => console.log(`SEVENCARGO listening on ${PORT}`));
})().catch((e) => { console.error(e); process.exit(1); });
