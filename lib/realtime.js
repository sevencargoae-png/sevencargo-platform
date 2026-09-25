'use strict';
const { q } = require('../db');

let io = null;
function setIO(instance) { io = instance; }
function getIO() { return io; }

async function notifyAdmins(type, title, body, orderId = null) {
  const { rows } = await q(
    'INSERT INTO notifications(target, type, title, body, order_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    ['admin', type, title, body || '', orderId]
  );
  if (io) io.to('admins').emit('notify', rows[0]);
  return rows[0];
}

async function notifyDriver(driverId, type, title, body, orderId = null) {
  const { rows } = await q(
    'INSERT INTO notifications(target, driver_id, type, title, body, order_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    ['driver', driverId, type, title, body || '', orderId]
  );
  if (io) io.to('driver:' + driverId).emit('notify', rows[0]);
  return rows[0];
}

// Signals every party that an order changed; clients re-fetch what they are allowed to see.
function orderChanged(order) {
  if (!io || !order) return;
  const payload = { id: order.id, tracking_no: order.tracking_no, status: order.status, driver_id: order.driver_id };
  io.to('admins').emit('order-changed', payload);
  io.to('order:' + order.id).emit('order-changed', payload);
  if (order.driver_id) io.to('driver:' + order.driver_id).emit('order-changed', payload);
}

function chatMessage(msg, driverIdForOrder = null) {
  if (!io) return;
  if (msg.order_id) {
    io.to('order:' + msg.order_id).emit('chat', msg);
    io.to('admins').emit('chat', msg);
    if (driverIdForOrder) io.to('driver:' + driverIdForOrder).emit('chat', msg);
  } else if (msg.driver_id) {
    io.to('admins').emit('chat', msg);
    io.to('driver:' + msg.driver_id).emit('chat', msg);
  }
}

module.exports = { setIO, getIO, notifyAdmins, notifyDriver, orderChanged, chatMessage };
