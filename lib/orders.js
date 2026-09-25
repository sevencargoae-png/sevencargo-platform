'use strict';
const { q } = require('../db');

const ACTIVE_DRIVER_STATUSES = ['assigned', 'accepted', 'picked_up'];

async function addEvent(orderId, status, actor, note = null, lat = null, lng = null, flagged = false) {
  await q(
    `INSERT INTO order_events(order_id, status, actor_type, actor_id, actor_name, note, lat, lng, flagged)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [orderId, status, actor.type, actor.id || null, actor.name || null, note, lat, lng, flagged]
  );
}

async function getOrder(id) {
  const { rows } = await q(
    `SELECT o.*, d.name AS driver_name, d.phone AS driver_phone, d.vehicle_type AS driver_vehicle,
            d.vehicle_plate AS driver_plate, d.last_lat AS driver_lat, d.last_lng AS driver_lng, d.last_loc_at AS driver_loc_at,
            r.stars AS rating_stars, r.comment AS rating_comment
       FROM orders o
       LEFT JOIN drivers d ON d.id = o.driver_id
       LEFT JOIN ratings r ON r.order_id = o.id
      WHERE o.id = $1`, [id]
  );
  return rows[0] || null;
}

async function getEvents(orderId, includeActors = false) {
  const { rows } = await q('SELECT * FROM order_events WHERE order_id=$1 ORDER BY created_at ASC, id ASC', [orderId]);
  if (includeActors) return rows;
  // customers only see the timeline, not internal notes/actors/flags
  const INTERNAL = ['rejected', 'reassigned', 'note', 'payment_pending', 'cash_settled'];
  return rows
    .filter((e) => !INTERNAL.includes(e.status))
    .map((e) => ({ status: e.status, created_at: e.created_at, note: ['failed', 'cancelled'].includes(e.status) ? e.note : null }));
}

async function getMessages(orderId) {
  const { rows } = await q('SELECT id, order_id, sender_type, sender_name, body, created_at FROM messages WHERE order_id=$1 ORDER BY id ASC', [orderId]);
  return rows;
}

const n = (v) => (v == null ? null : Number(v));

function common(o) {
  return {
    id: o.id, tracking_no: o.tracking_no, status: o.status,
    payment_method: o.payment_method, payment_status: o.payment_status,
    amount: n(o.amount), currency: o.currency, price_breakdown: o.price_breakdown,
    sender_name: o.sender_name, sender_phone: o.sender_phone,
    pickup_address: o.pickup_address, pickup_lat: o.pickup_lat, pickup_lng: o.pickup_lng, pickup_emirate: o.pickup_emirate,
    receiver_name: o.receiver_name, receiver_phone: o.receiver_phone,
    dropoff_address: o.dropoff_address, dropoff_lat: o.dropoff_lat, dropoff_lng: o.dropoff_lng, dropoff_emirate: o.dropoff_emirate,
    weight_kg: n(o.weight_kg), length_cm: n(o.length_cm), width_cm: n(o.width_cm), height_cm: n(o.height_cm),
    content_type: o.content_type, description: o.description, declared_value: n(o.declared_value),
    photo_url: o.photo_id ? '/files/' + o.photo_id : null,
    distance_km: n(o.distance_km),
    assigned_at: o.assigned_at, accepted_at: o.accepted_at, picked_up_at: o.picked_up_at,
    delivered_at: o.delivered_at, cancelled_at: o.cancelled_at, fail_reason: o.fail_reason,
    created_at: o.created_at, updated_at: o.updated_at,
  };
}

const LIVE_STATUSES = ['accepted', 'picked_up'];

function forCustomer(o) {
  const out = common(o);
  out.delivery_code = ['delivered', 'cancelled'].includes(o.status) ? null : o.delivery_code;
  out.driver = o.driver_id && ['accepted', 'picked_up', 'delivered', 'failed'].includes(o.status)
    ? { name: o.driver_name, phone: o.driver_phone, vehicle: o.driver_vehicle, plate: o.driver_plate } : null;
  out.driver_location = o.driver_id && LIVE_STATUSES.includes(o.status) && o.driver_lat != null
    ? { lat: o.driver_lat, lng: o.driver_lng, at: o.driver_loc_at } : null;
  out.delivery_photo_url = o.delivery_photo_id ? '/files/' + o.delivery_photo_id : null;
  out.rating = o.rating_stars ? { stars: o.rating_stars, comment: o.rating_comment } : null;
  return out;
}

function forDriver(o) {
  const out = common(o);
  // the driver never sees the delivery confirmation code
  out.cash_to_collect = o.payment_status === 'paid' ? 0 : n(o.amount);
  out.cash_collected = n(o.cash_collected);
  out.pickup_photo_url = o.pickup_photo_id ? '/files/' + o.pickup_photo_id : null;
  out.delivery_photo_url = o.delivery_photo_id ? '/files/' + o.delivery_photo_id : null;
  return out;
}

function forAdmin(o) {
  const out = common(o);
  Object.assign(out, {
    delivery_code: o.delivery_code, driver_id: o.driver_id,
    driver: o.driver_id ? { id: o.driver_id, name: o.driver_name, phone: o.driver_phone, vehicle: o.driver_vehicle, plate: o.driver_plate } : null,
    driver_location: o.driver_lat != null ? { lat: o.driver_lat, lng: o.driver_lng, at: o.driver_loc_at } : null,
    pickup_photo_url: o.pickup_photo_id ? '/files/' + o.pickup_photo_id : null,
    delivery_photo_url: o.delivery_photo_id ? '/files/' + o.delivery_photo_id : null,
    admin_notes: o.admin_notes, cash_collected: n(o.cash_collected), cash_settled: o.cash_settled,
    flagged: o.flagged, created_ip: o.created_ip, stripe_session_id: o.stripe_session_id,
    rating: o.rating_stars ? { stars: o.rating_stars, comment: o.rating_comment } : null,
  });
  return out;
}

module.exports = { ACTIVE_DRIVER_STATUSES, LIVE_STATUSES, addEvent, getOrder, getEvents, getMessages, forCustomer, forDriver, forAdmin };
