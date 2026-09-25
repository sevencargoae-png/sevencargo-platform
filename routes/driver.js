'use strict';
const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const { q, getSettings } = require('../db');
const H = require('../lib/helpers');
const O = require('../lib/orders');
const rt = require('../lib/realtime');

const router = express.Router();
const { wrap, bad, HttpError, requireDriver } = H;

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { error: 'too_many_attempts' } });

router.post('/login', loginLimiter, wrap(async (req, res) => {
  const phone = H.phone((req.body || {}).phone);
  const password = String((req.body || {}).password || '');
  const { rows } = await q('SELECT * FROM drivers WHERE phone=$1', [phone]);
  const d = rows[0];
  if (!d || !d.active || !(await bcrypt.compare(password, d.password_hash))) throw new HttpError(401, 'invalid_credentials');
  H.setAuthCookie(res, H.COOKIES.driver, H.signToken({ t: 'driver', id: d.id, tv: d.token_version }));
  res.json({ id: d.id, name: d.name });
}));
router.post('/logout', (req, res) => { H.clearAuthCookie(res, H.COOKIES.driver); res.json({ ok: true }); });

router.use(requireDriver);
const actor = (req) => ({ type: 'driver', id: req.driver.id, name: req.driver.name });

router.get('/me', wrap(async (req, res) => {
  const d = req.driver;
  const { rows: [st] } = await q(`
    SELECT count(*) FILTER (WHERE status='delivered' AND delivered_at::date=(now() AT TIME ZONE 'Asia/Dubai')::date)::int AS delivered_today,
           coalesce(sum(cash_collected) FILTER (WHERE NOT cash_settled),0) AS cash_due
      FROM orders WHERE driver_id=$1`, [d.id]);
  const { rows: [r] } = await q('SELECT round(avg(stars)::numeric,2) AS avg, count(*)::int AS n FROM ratings WHERE driver_id=$1', [d.id]);
  res.json({
    id: d.id, name: d.name, phone: d.phone, emirate: d.emirate, route_areas: d.route_areas,
    vehicle_type: d.vehicle_type, vehicle_plate: d.vehicle_plate, duty_status: d.duty_status, checked_in_at: d.checked_in_at,
    delivered_today: st.delivered_today, cash_due: Number(st.cash_due), rating: r.avg == null ? null : Number(r.avg), ratings: r.n,
  });
}));

router.post('/checkin', wrap(async (req, res) => {
  const b = req.body || {};
  const lat = b.lat == null ? null : H.num(b.lat, { min: -90, max: 90, name: 'lat' });
  const lng = b.lng == null ? null : H.num(b.lng, { min: -180, max: 180, name: 'lng' });
  if (req.driver.duty_status === 'available') return res.json({ ok: true });
  await q(`UPDATE drivers SET duty_status='available', checked_in_at=now(), last_lat=coalesce($2,last_lat), last_lng=coalesce($3,last_lng), last_loc_at=CASE WHEN $2::float8 IS NULL THEN last_loc_at ELSE now() END WHERE id=$1`, [req.driver.id, lat, lng]);
  await q('INSERT INTO attendance(driver_id, in_lat, in_lng) VALUES ($1,$2,$3)', [req.driver.id, lat, lng]);
  await rt.notifyAdmins('driver_checkin', `${req.driver.name} checked in`, `${req.driver.emirate}`);
  rt.getIO() && rt.getIO().to('admins').emit('drivers-changed');
  res.json({ ok: true });
}));

router.post('/checkout', wrap(async (req, res) => {
  await q(`UPDATE drivers SET duty_status='off' WHERE id=$1`, [req.driver.id]);
  await q('UPDATE attendance SET check_out=now() WHERE driver_id=$1 AND check_out IS NULL', [req.driver.id]);
  rt.getIO() && rt.getIO().to('admins').emit('drivers-changed');
  res.json({ ok: true });
}));

router.get('/orders', wrap(async (req, res) => {
  const scope = req.query.scope === 'history' ? 'history' : 'active';
  const cond = scope === 'active' ? `status IN ('assigned','accepted','picked_up')` : `status IN ('delivered','failed','cancelled')`;
  const { rows } = await q(`SELECT id FROM orders WHERE driver_id=$1 AND ${cond} ORDER BY ${scope === 'active' ? 'assigned_at ASC' : 'updated_at DESC'} LIMIT 100`, [req.driver.id]);
  const out = [];
  for (const r of rows) out.push(O.forDriver(await O.getOrder(r.id)));
  res.json(out);
}));

async function ownOrder(req, allowed) {
  const id = Number(req.params.id);
  const o = await O.getOrder(id);
  if (!o || o.driver_id !== req.driver.id) throw new HttpError(404, 'not_found');
  if (allowed && !allowed.includes(o.status)) throw bad('invalid_status_for_action');
  return o;
}

router.get('/orders/:id', wrap(async (req, res) => {
  const o = await ownOrder(req);
  res.json({ order: O.forDriver(o), messages: await O.getMessages(o.id) });
}));

router.post('/orders/:id/accept', wrap(async (req, res) => {
  const o = await ownOrder(req, ['assigned']);
  const { rows } = await q(`UPDATE orders SET status='accepted', accepted_at=now(), updated_at=now() WHERE id=$1 AND status='assigned' AND driver_id=$2 RETURNING *`, [o.id, req.driver.id]);
  if (!rows[0]) throw bad('invalid_status_for_action');
  await O.addEvent(o.id, 'accepted', actor(req));
  await rt.notifyAdmins('order_accepted', `${req.driver.name} accepted ${o.tracking_no}`, '', o.id);
  rt.orderChanged(rows[0]);
  res.json({ ok: true });
}));

router.post('/orders/:id/reject', wrap(async (req, res) => {
  const o = await ownOrder(req, ['assigned', 'accepted']);
  const reason = H.str((req.body || {}).reason, { min: 3, max: 500, name: 'reason' });
  const { rows } = await q(`UPDATE orders SET status='pending', driver_id=NULL, assigned_at=NULL, accepted_at=NULL, updated_at=now()
                            WHERE id=$1 AND driver_id=$2 AND status IN ('assigned','accepted') RETURNING *`, [o.id, req.driver.id]);
  if (!rows[0]) throw bad('invalid_status_for_action');
  await O.addEvent(o.id, 'rejected', actor(req), reason);
  await rt.notifyAdmins('order_rejected', `${req.driver.name} rejected ${o.tracking_no}`, reason, o.id);
  rt.orderChanged(rows[0]);
  rt.getIO() && rt.getIO().to('driver:' + req.driver.id).emit('order-changed', { id: o.id });
  res.json({ ok: true });
}));

async function geofence(req, o, target, b) {
  const s = await getSettings();
  const lat = H.num(b.lat, { min: -90, max: 90, name: 'location' });
  const lng = H.num(b.lng, { min: -180, max: 180, name: 'location' });
  const dest = target === 'pickup' ? { lat: o.pickup_lat, lng: o.pickup_lng } : { lat: o.dropoff_lat, lng: o.dropoff_lng };
  const meters = Math.round(H.haversineKm({ lat, lng }, dest) * 1000);
  const outside = meters > Number(s.limits.geofence_m || 500);
  let note = null;
  if (outside) {
    note = H.str(b.override_reason, { max: 300, name: 'override_reason' });
    if (!note) { const e = bad('outside_geofence'); e.meters = meters; throw e; }
  }
  return { lat, lng, meters, outside, note, settings: s };
}

router.post('/orders/:id/pickup', wrap(async (req, res) => {
  const b = req.body || {};
  const o = await ownOrder(req, ['accepted']);
  const g = await geofence(req, o, 'pickup', b);
  const photoId = await H.saveDataUrl(b.photo, { required: true, name: 'photo' });
  const collectNow = o.payment_method === 'cash_sender' && o.payment_status !== 'paid';
  if (collectNow && b.cash_confirmed !== true) throw bad('confirm_cash_collected');
  const { rows } = await q(
    `UPDATE orders SET status='picked_up', picked_up_at=now(), pickup_photo_id=$2, updated_at=now(),
            flagged = flagged OR $3,
            payment_status = CASE WHEN $4 THEN 'paid' ELSE payment_status END,
            cash_collected = CASE WHEN $4 THEN amount ELSE cash_collected END
      WHERE id=$1 AND status='accepted' RETURNING *`, [o.id, photoId, g.outside, collectNow]
  );
  if (!rows[0]) throw bad('invalid_status_for_action');
  await O.addEvent(o.id, 'picked_up', actor(req), g.outside ? `Outside pickup zone by ${g.meters} m: ${g.note}` : `Within ${g.meters} m`, g.lat, g.lng, g.outside);
  if (collectNow) await O.addEvent(o.id, 'cash_collected', actor(req), `AED ${o.amount} from sender`, g.lat, g.lng);
  if (g.outside) await rt.notifyAdmins('flag', `⚠ Pickup outside zone (${g.meters} m)`, `${o.tracking_no} — ${req.driver.name}: ${g.note}`, o.id);
  rt.orderChanged(rows[0]);
  res.json({ ok: true });
}));

router.post('/orders/:id/deliver', wrap(async (req, res) => {
  const b = req.body || {};
  const o = await ownOrder(req, ['picked_up']);
  const code = String(b.code || '').trim();
  if (code !== o.delivery_code) {
    await O.addEvent(o.id, 'note', actor(req), 'Wrong delivery code entered', null, null, true);
    const { rows: [c] } = await q(`SELECT count(*)::int AS n FROM order_events WHERE order_id=$1 AND note='Wrong delivery code entered'`, [o.id]);
    if (c.n >= 3) {
      await q('UPDATE orders SET flagged=true WHERE id=$1', [o.id]);
      if (c.n === 3) await rt.notifyAdmins('flag', '⚠ Repeated wrong delivery code', `${o.tracking_no} — ${req.driver.name}`, o.id);
    }
    throw bad('wrong_delivery_code');
  }
  const g = await geofence(req, o, 'dropoff', b);
  const photoId = await H.saveDataUrl(b.photo, { required: !!g.settings.limits.require_delivery_photo, name: 'photo' });
  const collectNow = o.payment_method === 'cash_receiver' && o.payment_status !== 'paid';
  if (collectNow && b.cash_confirmed !== true) throw bad('confirm_cash_collected');
  const { rows } = await q(
    `UPDATE orders SET status='delivered', delivered_at=now(), delivery_photo_id=$2, updated_at=now(),
            flagged = flagged OR $3,
            payment_status = CASE WHEN $4 THEN 'paid' ELSE payment_status END,
            cash_collected = CASE WHEN $4 THEN amount ELSE cash_collected END
      WHERE id=$1 AND status='picked_up' RETURNING *`, [o.id, photoId, g.outside, collectNow]
  );
  if (!rows[0]) throw bad('invalid_status_for_action');
  await O.addEvent(o.id, 'delivered', actor(req), g.outside ? `Outside delivery zone by ${g.meters} m: ${g.note}` : `Within ${g.meters} m, code verified`, g.lat, g.lng, g.outside);
  if (collectNow) await O.addEvent(o.id, 'cash_collected', actor(req), `AED ${o.amount} from receiver`, g.lat, g.lng);
  await rt.notifyAdmins(g.outside ? 'flag' : 'order_delivered', g.outside ? `⚠ Delivered outside zone (${g.meters} m)` : `Delivered ${o.tracking_no}`, `${req.driver.name}`, o.id);
  rt.orderChanged(rows[0]);
  res.json({ ok: true });
}));

router.post('/orders/:id/fail', wrap(async (req, res) => {
  const b = req.body || {};
  const o = await ownOrder(req, ['accepted', 'picked_up']);
  const reason = H.str(b.reason, { min: 3, max: 500, name: 'reason' });
  const lat = b.lat == null ? null : H.num(b.lat, { min: -90, max: 90, name: 'lat' });
  const lng = b.lng == null ? null : H.num(b.lng, { min: -180, max: 180, name: 'lng' });
  const { rows } = await q(`UPDATE orders SET status='failed', fail_reason=$2, updated_at=now() WHERE id=$1 AND status IN ('accepted','picked_up') RETURNING *`, [o.id, reason]);
  if (!rows[0]) throw bad('invalid_status_for_action');
  await O.addEvent(o.id, 'failed', actor(req), reason, lat, lng);
  await rt.notifyAdmins('order_failed', `Delivery failed ${o.tracking_no}`, `${req.driver.name}: ${reason}`, o.id);
  rt.orderChanged(rows[0]);
  res.json({ ok: true });
}));

router.post('/orders/:id/messages', wrap(async (req, res) => {
  const o = await ownOrder(req);
  const body = H.str((req.body || {}).body, { min: 1, max: 1000, name: 'message' });
  const { rows } = await q('INSERT INTO messages(order_id, sender_type, sender_name, body) VALUES ($1,$2,$3,$4) RETURNING *', [o.id, 'driver', req.driver.name, body]);
  rt.chatMessage(rows[0], o.driver_id);
  res.status(201).json(rows[0]);
}));

// direct chat with operations
router.get('/messages', wrap(async (req, res) => {
  const { rows } = await q('SELECT * FROM messages WHERE driver_id=$1 AND order_id IS NULL ORDER BY id ASC LIMIT 500', [req.driver.id]);
  res.json(rows);
}));
router.post('/messages', wrap(async (req, res) => {
  const body = H.str((req.body || {}).body, { min: 1, max: 1000, name: 'message' });
  const { rows } = await q('INSERT INTO messages(driver_id, sender_type, sender_name, body) VALUES ($1,$2,$3,$4) RETURNING *', [req.driver.id, 'driver', req.driver.name, body]);
  rt.chatMessage(rows[0]);
  await rt.notifyAdmins('chat', `Message from ${req.driver.name}`, body.slice(0, 80));
  res.status(201).json(rows[0]);
}));

// incidents / emergencies
router.get('/incidents', wrap(async (req, res) => {
  const { rows } = await q(`SELECT c.*, o.tracking_no FROM complaints c LEFT JOIN orders o ON o.id=c.order_id WHERE c.source='driver' AND c.driver_id=$1 ORDER BY c.created_at DESC LIMIT 50`, [req.driver.id]);
  res.json(rows.map((c) => ({ ...c, photo_url: c.photo_id ? '/files/' + c.photo_id : null })));
}));
router.post('/incidents', wrap(async (req, res) => {
  const b = req.body || {};
  const category = ['accident', 'vehicle', 'customer', 'address', 'damage', 'emergency', 'other'].includes(b.category) ? b.category : 'other';
  const body = H.str(b.body, { min: 5, max: 2000, name: 'body' });
  let orderId = null;
  if (b.order_id) {
    const o = await O.getOrder(Number(b.order_id));
    if (!o || o.driver_id !== req.driver.id) throw bad('invalid_order');
    orderId = o.id;
  }
  const lat = b.lat == null ? null : H.num(b.lat, { min: -90, max: 90, name: 'lat' });
  const lng = b.lng == null ? null : H.num(b.lng, { min: -180, max: 180, name: 'lng' });
  const photoId = await H.saveDataUrl(b.photo, { name: 'photo' });
  const { rows } = await q(
    `INSERT INTO complaints(source, order_id, driver_id, name, phone, category, body, photo_id, lat, lng) VALUES ('driver',$1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
    [orderId, req.driver.id, req.driver.name, req.driver.phone, category, body, photoId, lat, lng]
  );
  await rt.notifyAdmins(category === 'emergency' || category === 'accident' ? 'emergency' : 'incident', `${category === 'emergency' || category === 'accident' ? '🚨 ' : ''}Driver report: ${req.driver.name}`, `${category}: ${body.slice(0, 100)}`, orderId);
  res.status(201).json({ id: rows[0].id });
}));

router.get('/notifications', wrap(async (req, res) => {
  const { rows } = await q(`SELECT * FROM notifications WHERE target='driver' AND driver_id=$1 ORDER BY id DESC LIMIT 40`, [req.driver.id]);
  const { rows: [c] } = await q(`SELECT count(*)::int AS n FROM notifications WHERE target='driver' AND driver_id=$1 AND NOT read`, [req.driver.id]);
  res.json({ unread: c.n, items: rows });
}));
router.post('/notifications/read', wrap(async (req, res) => {
  await q(`UPDATE notifications SET read=true WHERE target='driver' AND driver_id=$1 AND NOT read`, [req.driver.id]);
  res.json({ ok: true });
}));

module.exports = router;
