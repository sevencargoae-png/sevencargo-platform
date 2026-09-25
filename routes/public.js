'use strict';
const express = require('express');
const rateLimit = require('express-rate-limit');
const { q, getSettings, EMIRATES } = require('../db');
const H = require('../lib/helpers');
const O = require('../lib/orders');
const rt = require('../lib/realtime');
const pay = require('../lib/payments');

const router = express.Router();
const { wrap, bad, HttpError } = H;

const orderLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 15, standardHeaders: true, legacyHeaders: false, message: { error: 'too_many_requests' } });
const trackLimiter = rateLimit({ windowMs: 10 * 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false, message: { error: 'too_many_requests' } });
const writeLimiter = rateLimit({ windowMs: 10 * 60 * 1000, limit: 40, standardHeaders: true, legacyHeaders: false, message: { error: 'too_many_requests' } });

// ---------- config ----------
router.get('/config', wrap(async (req, res) => {
  const s = await getSettings();
  res.json({
    emirates: Object.fromEntries(Object.entries(EMIRATES).map(([k, v]) => [k, { ...v, active: s.pricing.emirates[k] ? s.pricing.emirates[k].active !== false : false, base: s.pricing.emirates[k] ? s.pricing.emirates[k].base : null }])),
    pricing: s.pricing, limits: s.limits, contact: s.contact, prohibited: s.prohibited,
    online_payment: pay.enabled(),
  });
}));

// ---------- pricing ----------
async function buildQuote(body) {
  const settings = await getSettings();
  const pickup = await H.resolvePoint(body.pickup, 'pickup');
  const dropoff = await H.resolvePoint(body.dropoff, 'dropoff');
  const L = settings.limits;
  const weight = H.num(body.weight_kg, { min: 0.1, max: L.max_weight_kg, name: 'weight' });
  const l = H.num(body.length_cm, { min: 1, max: L.max_dim_cm, name: 'length' });
  const w = H.num(body.width_cm, { min: 1, max: L.max_dim_cm, name: 'width' });
  const h = H.num(body.height_cm, { min: 1, max: L.max_dim_cm, name: 'height' });
  const method = ['online', 'cash_sender', 'cash_receiver'].includes(body.payment_method) ? body.payment_method : 'cash_sender';
  const dist = await H.roadDistanceKm(pickup, dropoff);
  const price = H.calcPrice(settings, { pickupEmirate: pickup.emirate, dropoffEmirate: dropoff.emirate, km: dist.km, weight, l, w, h, method });
  price.distance_source = dist.source;
  return { settings, pickup, dropoff, weight, l, w, h, method, price };
}

router.post('/quote', trackLimiter, wrap(async (req, res) => {
  const qt = await buildQuote(req.body || {});
  res.json({ price: qt.price, pickup_emirate: qt.pickup.emirate, dropoff_emirate: qt.dropoff.emirate });
}));

// ---------- create order ----------
router.post('/orders', orderLimiter, wrap(async (req, res) => {
  const b = req.body || {};
  if (b.accept_terms !== true) throw bad('must_accept_terms');
  if (b.website) throw bad('rejected'); // honeypot
  const qt = await buildQuote(b);
  if (qt.method === 'online' && !pay.enabled()) throw bad('online_payment_unavailable');

  const sender_name = H.str(b.sender_name, { min: 2, max: 80, name: 'sender_name' });
  const sender_phone = H.phone(b.sender_phone, 'sender_phone');
  const pickup_address = H.str(b.pickup_address, { min: 3, max: 300, name: 'pickup_address' });
  const receiver_name = H.str(b.receiver_name, { min: 2, max: 80, name: 'receiver_name' });
  const receiver_phone = H.phone(b.receiver_phone, 'receiver_phone');
  const dropoff_address = H.str(b.dropoff_address, { min: 3, max: 300, name: 'dropoff_address' });
  const content_type = H.str(b.content_type, { min: 2, max: 80, name: 'content_type' });
  const description = H.str(b.description, { max: 500, name: 'description' });
  const declared_value = b.declared_value === '' || b.declared_value == null ? null : H.num(b.declared_value, { min: 0, max: 1000000, name: 'declared_value' });
  const photoId = await H.saveDataUrl(b.photo, { required: true, name: 'photo' });

  let tracking; let order;
  for (let i = 0; i < 5 && !order; i++) {
    tracking = H.genTrackingNo();
    try {
      const { rows } = await q(
        `INSERT INTO orders(tracking_no, status, payment_method, amount, price_breakdown,
           sender_name, sender_phone, pickup_address, pickup_lat, pickup_lng, pickup_emirate,
           receiver_name, receiver_phone, dropoff_address, dropoff_lat, dropoff_lng, dropoff_emirate,
           weight_kg, length_cm, width_cm, height_cm, content_type, description, declared_value, photo_id,
           distance_km, delivery_code, created_ip)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28)
         RETURNING *`,
        [tracking, qt.method === 'online' ? 'awaiting_payment' : 'pending', qt.method, qt.price.total, JSON.stringify(qt.price),
          sender_name, sender_phone, pickup_address, qt.pickup.lat, qt.pickup.lng, qt.pickup.emirate,
          receiver_name, receiver_phone, dropoff_address, qt.dropoff.lat, qt.dropoff.lng, qt.dropoff.emirate,
          qt.weight, qt.l, qt.w, qt.h, content_type, description, declared_value, photoId,
          qt.price.distance_km, H.genCode(), req.ip]
      );
      order = rows[0];
    } catch (e) { if (e.code !== '23505') throw e; }
  }
  if (!order) throw new Error('could_not_allocate_tracking');

  await O.addEvent(order.id, 'created', { type: 'customer', name: sender_name });
  let checkout_url = null;
  if (qt.method === 'online') {
    await O.addEvent(order.id, 'payment_pending', { type: 'system' });
    checkout_url = await pay.createCheckout(req, order);
  } else {
    await O.addEvent(order.id, 'pending', { type: 'system' });
    await rt.notifyAdmins('new_order', 'New order', `${order.tracking_no} — ${order.pickup_emirate} → ${order.dropoff_emirate}`, order.id);
    rt.orderChanged(order);
  }
  H.grantCustomer(req, res, [order.id]);
  res.status(201).json({ id: order.id, tracking_no: order.tracking_no, delivery_code: order.delivery_code, amount: Number(order.amount), status: order.status, checkout_url });
}));

// ---------- tracking ----------
router.get('/track', trackLimiter, wrap(async (req, res) => {
  const no = String(req.query.no || '').trim().toUpperCase();
  const ph = String(req.query.phone || '').trim();
  let rows;
  if (no) {
    if (!/^SC\d{8}$/.test(no)) throw bad('invalid_tracking');
    ({ rows } = await q('SELECT id FROM orders WHERE tracking_no=$1', [no]));
  } else if (ph) {
    const p = H.phone(ph);
    ({ rows } = await q(`SELECT id FROM orders WHERE (sender_phone=$1 OR receiver_phone=$1) AND status<>'awaiting_payment' OR (sender_phone=$1 AND status='awaiting_payment')
                         ORDER BY created_at DESC LIMIT 30`, [p]));
  } else throw bad('missing_query');
  if (!rows.length) throw new HttpError(404, 'not_found');
  const ids = rows.map((r) => r.id);
  H.grantCustomer(req, res, ids);
  const { rows: list } = await q(
    `SELECT id, tracking_no, status, payment_status, payment_method, amount, pickup_emirate, dropoff_emirate, sender_name, receiver_name, created_at
       FROM orders WHERE id = ANY($1) ORDER BY created_at DESC`, [ids]
  );
  res.json({ orders: list.map((o) => ({ ...o, amount: Number(o.amount) })) });
}));

function custAccess(req) {
  const id = Number(req.params.id);
  if (!id || !H.custOrders(req.cookies[H.COOKIES.cust]).includes(id)) throw new HttpError(403, 'no_access');
  return id;
}

router.get('/orders/:id', wrap(async (req, res) => {
  const id = custAccess(req);
  const o = await O.getOrder(id);
  if (!o) throw new HttpError(404, 'not_found');
  res.json({ order: O.forCustomer(o), events: await O.getEvents(id), messages: await O.getMessages(id) });
}));

router.post('/orders/:id/pay', writeLimiter, wrap(async (req, res) => {
  const id = custAccess(req);
  const o = await O.getOrder(id);
  if (!o) throw new HttpError(404, 'not_found');
  if (o.payment_status === 'paid') throw bad('already_paid');
  if (o.payment_method !== 'online' || o.status !== 'awaiting_payment') throw bad('not_payable');
  res.json({ checkout_url: await pay.createCheckout(req, o) });
}));

router.post('/orders/:id/verify-payment', writeLimiter, wrap(async (req, res) => {
  const id = custAccess(req);
  const o = await O.getOrder(id);
  if (!o) throw new HttpError(404, 'not_found');
  let paid = o.payment_status === 'paid';
  if (!paid) paid = await pay.verifyOrderPayment(o);
  res.json({ paid });
}));

router.post('/orders/:id/switch-to-cash', writeLimiter, wrap(async (req, res) => {
  const id = custAccess(req);
  const method = (req.body || {}).payment_method;
  if (!['cash_sender', 'cash_receiver'].includes(method)) throw bad('invalid_payment_method');
  const s = await getSettings();
  const o = await O.getOrder(id);
  if (!o || o.status !== 'awaiting_payment' || o.payment_status === 'paid') throw bad('not_allowed');
  const price = { ...o.price_breakdown };
  const cod = Number(s.pricing.cod_fee) || 0;
  if (cod && !price.cod_fee) {
    price.cod_fee = cod; price.subtotal = Math.round((price.subtotal + cod) * 100) / 100;
    price.vat = Math.round(price.subtotal * (price.vat_percent || 0)) / 100;
    price.total = Math.round((price.subtotal + price.vat) * 100) / 100;
  }
  const { rows } = await q(`UPDATE orders SET payment_method=$1, status='pending', amount=$2, price_breakdown=$3, updated_at=now()
                            WHERE id=$4 AND status='awaiting_payment' RETURNING *`, [method, price.total, JSON.stringify(price), id]);
  if (!rows[0]) throw bad('not_allowed');
  await O.addEvent(id, 'pending', { type: 'customer' }, 'Switched to cash payment');
  await rt.notifyAdmins('new_order', 'New order', `${rows[0].tracking_no} — ${rows[0].pickup_emirate} → ${rows[0].dropoff_emirate}`, id);
  rt.orderChanged(rows[0]);
  res.json({ ok: true });
}));

router.post('/orders/:id/cancel', writeLimiter, wrap(async (req, res) => {
  const id = custAccess(req);
  const reason = H.str((req.body || {}).reason, { max: 300, name: 'reason' });
  const { rows } = await q(
    `UPDATE orders SET status='cancelled', cancelled_at=now(), updated_at=now()
      WHERE id=$1 AND status IN ('awaiting_payment','pending','assigned') AND payment_status<>'paid' RETURNING *`, [id]
  );
  if (!rows[0]) throw bad('cannot_cancel');
  await O.addEvent(id, 'cancelled', { type: 'customer' }, reason || 'Cancelled by customer');
  await rt.notifyAdmins('order_cancelled', 'Order cancelled by customer', rows[0].tracking_no, id);
  if (rows[0].driver_id) await rt.notifyDriver(rows[0].driver_id, 'order_cancelled', 'Order cancelled', rows[0].tracking_no, id);
  rt.orderChanged(rows[0]);
  res.json({ ok: true });
}));

router.post('/orders/:id/messages', writeLimiter, wrap(async (req, res) => {
  const id = custAccess(req);
  const body = H.str((req.body || {}).body, { min: 1, max: 1000, name: 'message' });
  const o = await O.getOrder(id);
  if (!o) throw new HttpError(404, 'not_found');
  const name = H.str((req.body || {}).name, { max: 60, name: 'name' }) || o.sender_name;
  const { rows } = await q('INSERT INTO messages(order_id, sender_type, sender_name, body) VALUES ($1,$2,$3,$4) RETURNING *', [id, 'customer', name, body]);
  rt.chatMessage(rows[0], o.driver_id);
  await rt.notifyAdmins('chat', 'Customer message', `${o.tracking_no}: ${body.slice(0, 80)}`, id);
  res.status(201).json(rows[0]);
}));

router.post('/orders/:id/rating', writeLimiter, wrap(async (req, res) => {
  const id = custAccess(req);
  const stars = H.num((req.body || {}).stars, { min: 1, max: 5, name: 'stars' });
  const comment = H.str((req.body || {}).comment, { max: 500, name: 'comment' });
  const o = await O.getOrder(id);
  if (!o || o.status !== 'delivered') throw bad('not_delivered');
  try {
    await q('INSERT INTO ratings(order_id, driver_id, stars, comment) VALUES ($1,$2,$3,$4)', [id, o.driver_id, Math.round(stars), comment]);
  } catch (e) { if (e.code === '23505') throw bad('already_rated'); throw e; }
  await rt.notifyAdmins('rating', `New rating ${Math.round(stars)}★`, `${o.tracking_no}${comment ? ': ' + comment.slice(0, 80) : ''}`, id);
  res.status(201).json({ ok: true });
}));

// ---------- complaints ----------
router.post('/complaints', writeLimiter, wrap(async (req, res) => {
  const b = req.body || {};
  if (b.website) throw bad('rejected');
  const name = H.str(b.name, { min: 2, max: 80, name: 'name' });
  const phone = H.phone(b.phone);
  const category = ['delay', 'damage', 'lost', 'driver', 'payment', 'other'].includes(b.category) ? b.category : 'other';
  const body = H.str(b.body, { min: 5, max: 2000, name: 'body' });
  let orderId = null;
  if (b.tracking_no) {
    const { rows } = await q('SELECT id, sender_phone, receiver_phone FROM orders WHERE tracking_no=$1', [String(b.tracking_no).trim().toUpperCase()]);
    if (!rows[0]) throw bad('invalid_tracking');
    orderId = rows[0].id;
  }
  const photoId = await H.saveDataUrl(b.photo, { name: 'photo' });
  const { rows } = await q(
    `INSERT INTO complaints(source, order_id, name, phone, category, body, photo_id) VALUES ('customer',$1,$2,$3,$4,$5,$6) RETURNING id`,
    [orderId, name, phone, category, body, photoId]
  );
  await rt.notifyAdmins('complaint', 'New customer complaint', `#${rows[0].id} — ${category}`, orderId);
  res.status(201).json({ id: rows[0].id });
}));

// ---------- reverse geocode proxy (keeps a proper User-Agent & caching) ----------
router.get('/geo/reverse', trackLimiter, wrap(async (req, res) => {
  const lat = H.num(req.query.lat, { min: -90, max: 90, name: 'lat' });
  const lng = H.num(req.query.lng, { min: -180, max: 180, name: 'lng' });
  const det = await H.detectEmirate(lat, lng);
  res.json({ emirate: det ? det.code : null, country: det ? det.country : null, in_uae: H.inUAE(lat, lng) });
}));

module.exports = router;
