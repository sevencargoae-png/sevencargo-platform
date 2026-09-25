'use strict';
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}
const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);
const pool = new Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: 10,
});

const q = (text, params) => pool.query(text, params);

const EMIRATES = {
  AUH: { ar: 'أبوظبي', en: 'Abu Dhabi', lat: 24.4539, lng: 54.3773 },
  DXB: { ar: 'دبي', en: 'Dubai', lat: 25.2048, lng: 55.2708 },
  SHJ: { ar: 'الشارقة', en: 'Sharjah', lat: 25.3463, lng: 55.4209 },
  AJM: { ar: 'عجمان', en: 'Ajman', lat: 25.4052, lng: 55.5136 },
  UAQ: { ar: 'أم القيوين', en: 'Umm Al Quwain', lat: 25.5647, lng: 55.5552 },
  RAK: { ar: 'رأس الخيمة', en: 'Ras Al Khaimah', lat: 25.8007, lng: 55.9762 },
  FUJ: { ar: 'الفجيرة', en: 'Fujairah', lat: 25.1288, lng: 56.3265 },
};

const DEFAULT_SETTINGS = {
  pricing: {
    emirates: {
      AUH: { base: 25, active: true },
      DXB: { base: 20, active: true },
      SHJ: { base: 20, active: true },
      AJM: { base: 20, active: true },
      UAQ: { base: 25, active: true },
      RAK: { base: 25, active: true },
      FUJ: { base: 25, active: true },
    },
    included_km: 25,
    per_km: 0.5,
    included_kg: 5,
    per_kg: 2,
    inter_emirate_fee: 10,
    cod_fee: 0,
    vat_percent: 0,
    vol_divisor: 5000,
    min_price: 15,
  },
  limits: {
    max_weight_kg: 30,
    max_dim_cm: 150,
    geofence_m: 500,
    require_delivery_photo: true,
  },
  contact: {
    whatsapp: '971553377985',
    whatsapp_display: '055 337 7985',
    email: '',
  },
  prohibited: [
    { ar: 'المتفجرات والألعاب النارية والذخيرة', en: 'Explosives, fireworks and ammunition' },
    { ar: 'الأسلحة وقطعها', en: 'Weapons and weapon parts' },
    { ar: 'المخدرات والمواد المخدرة والأدوية غير المرخصة', en: 'Narcotics and unlicensed medicines' },
    { ar: 'المواد القابلة للاشتعال (غاز، وقود، بنزين)', en: 'Flammable materials (gas, fuel, petrol)' },
    { ar: 'المواد الكيميائية والسامة والمشعة', en: 'Chemical, toxic and radioactive materials' },
    { ar: 'النقود والعملات والمعادن الثمينة والمجوهرات', en: 'Cash, currency, precious metals and jewellery' },
    { ar: 'الحيوانات الحية', en: 'Live animals' },
    { ar: 'الأطعمة سريعة التلف', en: 'Perishable food' },
    { ar: 'بطاريات الليثيوم المنفصلة', en: 'Loose lithium batteries' },
    { ar: 'أي مواد يحظرها القانون في دولة الإمارات', en: 'Any item prohibited by UAE law' },
  ],
};

const SCHEMA = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin','staff')),
  active BOOLEAN NOT NULL DEFAULT true,
  token_version INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS drivers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  emirate TEXT NOT NULL,
  route_areas TEXT NOT NULL DEFAULT '',
  vehicle_type TEXT NOT NULL DEFAULT '',
  vehicle_plate TEXT NOT NULL DEFAULT '',
  license_no TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  duty_status TEXT NOT NULL DEFAULT 'off' CHECK (duty_status IN ('off','available')),
  checked_in_at TIMESTAMPTZ,
  last_lat DOUBLE PRECISION,
  last_lng DOUBLE PRECISION,
  last_loc_at TIMESTAMPTZ,
  token_version INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  driver_id INT NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  check_in TIMESTAMPTZ NOT NULL DEFAULT now(),
  check_out TIMESTAMPTZ,
  in_lat DOUBLE PRECISION, in_lng DOUBLE PRECISION,
  by_admin BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mime TEXT NOT NULL,
  size INT NOT NULL,
  data BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  tracking_no TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('online','cash_sender','cash_receiver')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid','refunded')),
  amount NUMERIC(10,2) NOT NULL,
  price_breakdown JSONB NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AED',
  sender_name TEXT NOT NULL, sender_phone TEXT NOT NULL,
  pickup_address TEXT NOT NULL, pickup_lat DOUBLE PRECISION NOT NULL, pickup_lng DOUBLE PRECISION NOT NULL, pickup_emirate TEXT NOT NULL,
  receiver_name TEXT NOT NULL, receiver_phone TEXT NOT NULL,
  dropoff_address TEXT NOT NULL, dropoff_lat DOUBLE PRECISION NOT NULL, dropoff_lng DOUBLE PRECISION NOT NULL, dropoff_emirate TEXT NOT NULL,
  weight_kg NUMERIC(8,2) NOT NULL,
  length_cm NUMERIC(8,1) NOT NULL, width_cm NUMERIC(8,1) NOT NULL, height_cm NUMERIC(8,1) NOT NULL,
  content_type TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  declared_value NUMERIC(10,2),
  photo_id UUID REFERENCES files(id),
  distance_km NUMERIC(8,1) NOT NULL,
  delivery_code TEXT NOT NULL,
  driver_id INT REFERENCES drivers(id),
  assigned_at TIMESTAMPTZ, accepted_at TIMESTAMPTZ, picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ, cancelled_at TIMESTAMPTZ,
  pickup_photo_id UUID REFERENCES files(id),
  delivery_photo_id UUID REFERENCES files(id),
  fail_reason TEXT,
  admin_notes TEXT NOT NULL DEFAULT '',
  stripe_session_id TEXT,
  cash_collected NUMERIC(10,2) NOT NULL DEFAULT 0,
  cash_settled BOOLEAN NOT NULL DEFAULT false,
  cash_settled_at TIMESTAMPTZ,
  flagged BOOLEAN NOT NULL DEFAULT false,
  created_ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_driver_idx ON orders(driver_id);
CREATE INDEX IF NOT EXISTS orders_sender_phone_idx ON orders(sender_phone);
CREATE INDEX IF NOT EXISTS orders_receiver_phone_idx ON orders(receiver_phone);

CREATE TABLE IF NOT EXISTS order_events (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id INT,
  actor_name TEXT,
  note TEXT,
  lat DOUBLE PRECISION, lng DOUBLE PRECISION,
  flagged BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS order_events_order_idx ON order_events(order_id);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  driver_id INT REFERENCES drivers(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer','admin','driver')),
  sender_name TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS messages_order_idx ON messages(order_id);
CREATE INDEX IF NOT EXISTS messages_driver_idx ON messages(driver_id);

CREATE TABLE IF NOT EXISTS complaints (
  id SERIAL PRIMARY KEY,
  source TEXT NOT NULL CHECK (source IN ('customer','driver')),
  order_id INT REFERENCES orders(id) ON DELETE SET NULL,
  driver_id INT REFERENCES drivers(id) ON DELETE SET NULL,
  name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'other',
  body TEXT NOT NULL,
  photo_id UUID REFERENCES files(id),
  lat DOUBLE PRECISION, lng DOUBLE PRECISION,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
  admin_reply TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ratings (
  id SERIAL PRIMARY KEY,
  order_id INT UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  driver_id INT REFERENCES drivers(id) ON DELETE SET NULL,
  stars INT NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  target TEXT NOT NULL CHECK (target IN ('admin','driver')),
  driver_id INT REFERENCES drivers(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notifications_target_idx ON notifications(target, driver_id, read);
`;

async function migrate() {
  await q(SCHEMA);
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await q('INSERT INTO settings(key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', [key, JSON.stringify(value)]);
  }
}

async function getSettings() {
  const { rows } = await q('SELECT key, value FROM settings');
  const out = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  for (const r of rows) {
    if (Array.isArray(r.value)) out[r.key] = r.value;
    else out[r.key] = { ...(out[r.key] || {}), ...r.value };
  }
  return out;
}

module.exports = { pool, q, migrate, getSettings, EMIRATES, DEFAULT_SETTINGS };
