'use strict';
const { q } = require('../db');
const { addEvent, getOrder } = require('./orders');
const rt = require('./realtime');

const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;
const enabled = () => !!stripe;

function baseUrl(req) {
  if (process.env.PUBLIC_URL) return process.env.PUBLIC_URL.replace(/\/$/, '');
  return `${req.protocol}://${req.get('host')}`;
}

async function createCheckout(req, order) {
  if (!stripe) throw Object.assign(new Error('online_payment_unavailable'), { status: 400, code: 'online_payment_unavailable' });
  const url = baseUrl(req);
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      quantity: 1,
      price_data: {
        currency: 'aed',
        unit_amount: Math.round(Number(order.amount) * 100),
        product_data: { name: `SEVENCARGO shipment ${order.tracking_no}` },
      },
    }],
    metadata: { order_id: String(order.id), tracking_no: order.tracking_no },
    client_reference_id: String(order.id),
    success_url: `${url}/track?no=${order.tracking_no}&paid=1`,
    cancel_url: `${url}/track?no=${order.tracking_no}&paid=0`,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
  });
  await q('UPDATE orders SET stripe_session_id=$1, updated_at=now() WHERE id=$2', [session.id, order.id]);
  return session.url;
}

// Idempotent: marks an order paid once Stripe confirms the session is paid.
async function markPaidFromSession(session) {
  if (!session || session.payment_status !== 'paid') return false;
  const orderId = Number(session.metadata && session.metadata.order_id);
  if (!orderId) return false;
  const o = await getOrder(orderId);
  if (!o || o.payment_status === 'paid') return false;
  if (Math.round(Number(o.amount) * 100) !== session.amount_total) {
    await rt.notifyAdmins('payment_mismatch', 'Payment amount mismatch', `${o.tracking_no}`, o.id);
    return false;
  }
  const { rows } = await q(
    `UPDATE orders SET payment_status='paid', status = CASE WHEN status='awaiting_payment' THEN 'pending' ELSE status END,
            updated_at=now() WHERE id=$1 AND payment_status<>'paid' RETURNING *`, [orderId]
  );
  if (!rows[0]) return false;
  await addEvent(orderId, 'paid', { type: 'system', name: 'Stripe' }, 'Online payment confirmed');
  if (o.status === 'awaiting_payment') {
    await addEvent(orderId, 'pending', { type: 'system' });
    await rt.notifyAdmins('new_order', 'New order (paid online)', `${o.tracking_no} — ${o.pickup_emirate} → ${o.dropoff_emirate}`, orderId);
  }
  rt.orderChanged(rows[0]);
  return true;
}

async function verifyOrderPayment(order) {
  if (!stripe || !order.stripe_session_id || order.payment_status === 'paid') return false;
  const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
  return markPaidFromSession(session);
}

function constructEvent(rawBody, signature) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return null;
  return stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
}

module.exports = { enabled, createCheckout, markPaidFromSession, verifyOrderPayment, constructEvent };
