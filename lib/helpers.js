'use strict';
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { q, EMIRATES } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : 'dev-secret-change-me');
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not set');
  process.exit(1);
}
const IS_PROD = process.env.NODE_ENV === 'production';
const SESSION_MS = 12 * 60 * 60 * 1000;

const COOKIES = { admin: 'sc_admin_token', driver: 'sc_driver_token', cust: 'sc_cust_token' };

// ---------- errors ----------
class HttpError extends Error {
  constructor(status, code, message) { super(message || code); this.status = status; this.code = code; }
}
const bad = (code, msg) => new HttpError(400, code, msg);
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ---------- auth ----------
function signToken(payload, ms = SESSION_MS) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: Math.floor(ms / 1000) });
}
function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}
function setAuthCookie(res, name, token, ms = SESSION_MS) {
  res.cookie(name, token, { httpOnly: true, sameSite: 'lax', secure: IS_PROD, maxAge: ms, path: '/' });
}
function clearAuthCookie(res, name) {
  res.clearCookie(name, { httpOnly: true, sameSite: 'lax', secure: IS_PROD, path: '/' });
}

async function loadAdmin(token) {
  const p = verifyToken(token);
  if (!p || p.t !== 'admin') return null;
  const { rows } = await q('SELECT id, username, name, role, active, token_version FROM users WHERE id=$1', [p.id]);
  const u = rows[0];
  if (!u || !u.active || u.token_version !== p.tv) return null;
  return u;
}
async function loadDriver(token) {
  const p = verifyToken(token);
  if (!p || p.t !== 'driver') return null;
  const { rows } = await q('SELECT * FROM drivers WHERE id=$1', [p.id]);
  const d = rows[0];
  if (!d || !d.active || d.token_version !== p.tv) return null;
  delete d.password_hash;
  return d;
}
function custOrders(token) {
  const p = verifyToken(token);
  if (!p || p.t !== 'cust' || !Array.isArray(p.o)) return [];
  return p.o;
}

const requireAdmin = wrap(async (req, res, next) => {
  const u = await loadAdmin(req.cookies[COOKIES.admin]);
  if (!u) throw new HttpError(401, 'unauthorized');
  req.admin = u; next();
});
const requireSuperAdmin = (req, res, next) => {
  if (req.admin.role !== 'admin') return next(new HttpError(403, 'forbidden'));
  next();
};
const requireDriver = wrap(async (req, res, next) => {
  const d = await loadDriver(req.cookies[COOKIES.driver]);
  if (!d) throw new HttpError(401, 'unauthorized');
  req.driver = d; next();
});

function grantCustomer(req, res, orderIds) {
  const current = custOrders(req.cookies[COOKIES.cust]);
  const merged = [...new Set([...orderIds, ...current])].slice(0, 40);
  setAuthCookie(res, COOKIES.cust, signToken({ t: 'cust', o: merged }, 30 * 24 * 3600 * 1000), 30 * 24 * 3600 * 1000);
  return merged;
}

// ---------- validation ----------
function str(v, { min = 0, max = 500, name = 'field' } = {}) {
  const s = (v == null ? '' : String(v)).trim();
  if (s.length < min) throw bad('invalid_' + name);
  if (s.length > max) throw bad('too_long_' + name);
  return s;
}
function num(v, { min = -Infinity, max = Infinity, name = 'number' } = {}) {
  const n = Number(v);
  if (!Number.isFinite(n) || n < min || n > max) throw bad('invalid_' + name);
  return n;
}
// Normalises UAE / GCC phone numbers to digits with country code (e.g. 9715XXXXXXXX)
function phone(v, name = 'phone') {
  let s = String(v || '').replace(/[^\d+]/g, '');
  if (s.startsWith('+')) s = s.slice(1);
  if (s.startsWith('00')) s = s.slice(2);
  if (/^05\d{8}$/.test(s)) s = '971' + s.slice(1);
  else if (/^5\d{8}$/.test(s)) s = '971' + s;
  if (!/^9\d{9,13}$/.test(s)) throw bad('invalid_' + name);
  return s;
}
function inUAE(lat, lng) {
  return lat >= 22.4 && lat <= 26.6 && lng >= 51.0 && lng <= 56.9;
}
function emirateCode(v) {
  const c = String(v || '').toUpperCase();
  if (!EMIRATES[c]) throw bad('invalid_emirate');
  return c;
}

// ---------- files ----------
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
async function saveDataUrl(dataUrl, { required = false, name = 'photo' } = {}) {
  if (!dataUrl) { if (required) throw bad('missing_' + name); return null; }
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl));
  if (!m || !ALLOWED_MIME.includes(m[1])) throw bad('invalid_' + name);
  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > 3 * 1024 * 1024) throw bad('too_large_' + name);
  // magic-number check
  const isJpg = buf[0] === 0xff && buf[1] === 0xd8;
  const isPng = buf[0] === 0x89 && buf[1] === 0x50;
  const isWebp = buf.slice(8, 12).toString() === 'WEBP';
  if (!(isJpg || isPng || isWebp)) throw bad('invalid_' + name);
  const { rows } = await q('INSERT INTO files(mime, size, data) VALUES ($1,$2,$3) RETURNING id', [m[1], buf.length, buf]);
  return rows[0].id;
}

// ---------- geo ----------
function haversineKm(a, b) {
  const R = 6371, rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
const cache = new Map();
function cacheGet(k) { const v = cache.get(k); if (v && v.exp > Date.now()) return v.val; cache.delete(k); return undefined; }
function cacheSet(k, val, ms = 6 * 3600 * 1000) { if (cache.size > 5000) cache.clear(); cache.set(k, { val, exp: Date.now() + ms }); }

async function fetchJson(url, ms = 4000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'SEVENCARGO/1.0 (support contact via website)', 'Accept-Language': 'en' } });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; } finally { clearTimeout(t); }
}

// Road distance via OSRM, fallback to straight line x 1.3
async function roadDistanceKm(a, b) {
  const key = `d:${a.lat.toFixed(4)},${a.lng.toFixed(4)}:${b.lat.toFixed(4)},${b.lng.toFixed(4)}`;
  const c = cacheGet(key); if (c !== undefined) return c;
  let km = null, source = 'estimate';
  const j = await fetchJson(`https://router.project-osrm.org/route/v1/driving/${a.lng},${a.lat};${b.lng},${b.lat}?overview=false`);
  if (j && j.code === 'Ok' && j.routes && j.routes[0]) { km = j.routes[0].distance / 1000; source = 'road'; }
  if (km == null) km = haversineKm(a, b) * 1.3;
  const out = { km: Math.round(km * 10) / 10, source };
  cacheSet(key, out);
  return out;
}

const STATE_MAP = [
  ['abu dhabi', 'AUH'], ['dubai', 'DXB'], ['sharjah', 'SHJ'], ['ajman', 'AJM'],
  ['umm al', 'UAQ'], ['ras al', 'RAK'], ['fujairah', 'FUJ'],
];
// Detects emirate from coordinates using OpenStreetMap Nominatim. Returns { code, country } or null when unavailable.
async function detectEmirate(lat, lng) {
  const key = `e:${lat.toFixed(3)},${lng.toFixed(3)}`;
  const c = cacheGet(key); if (c !== undefined) return c;
  const j = await fetchJson(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=8&accept-language=en`, 3500);
  if (!j || !j.address) return null;
  const country = (j.address.country_code || '').toLowerCase();
  const st = String(j.address.state || j.address.region || j.address.city || '').toLowerCase();
  let code = null;
  for (const [k, v] of STATE_MAP) if (st.includes(k)) { code = v; break; }
  const out = { code, country };
  cacheSet(key, out, 24 * 3600 * 1000);
  return out;
}

async function resolvePoint(p, label) {
  const lat = num(p && p.lat, { min: -90, max: 90, name: label + '_lat' });
  const lng = num(p && p.lng, { min: -180, max: 180, name: label + '_lng' });
  if (!inUAE(lat, lng)) throw bad('outside_service_area');
  let emirate = null;
  const det = await detectEmirate(lat, lng);
  if (det && det.country && det.country !== 'ae') throw bad('outside_service_area');
  if (det && det.code) emirate = det.code;
  if (!emirate) emirate = emirateCode(p.emirate);
  return { lat, lng, emirate };
}

// Optional number: blank -> null, otherwise validated.
function optNum(v, opts) {
  if (v === '' || v == null) return null;
  return num(v, opts);
}

// Extracts coordinates from "lat,lng" text or a Google/Apple Maps link (short links are followed, whitelisted hosts only).
const MAP_HOSTS = /^(maps\.app\.goo\.gl|goo\.gl|maps\.google\.[a-z.]+|(www\.)?google\.[a-z.]+|maps\.apple\.com|g\.co)$/i;
function coordsFromText(s) {
  const pats = [/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, /@(-?\d+\.\d+),\s*(-?\d+\.\d+)/, /[?&](?:q|query|ll|daddr|destination|sll)=(-?\d+\.\d+)(?:,|%2C)\s*(-?\d+\.\d+)/i,
    /^\s*(-?\d{1,2}\.\d+)\s*[,،\s]\s*(-?\d{1,3}\.\d+)\s*$/];
  for (const re of pats) {
    const m = s.match(re);
    if (m) {
      const lat = Number(m[1]), lng = Number(m[2]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
    }
  }
  return null;
}
async function parseLocation(text) {
  let s = String(text || '').trim();
  if (!s) throw bad('invalid_location');
  const urlMatch = s.match(/https?:\/\/\S+/);
  let c = coordsFromText(urlMatch ? decodeURIComponent(urlMatch[0]) : s);
  if (!c && urlMatch) {
    let url = urlMatch[0];
    for (let i = 0; i < 4 && !c; i++) {
      let u; try { u = new URL(url); } catch { break; }
      if (!MAP_HOSTS.test(u.hostname)) break;
      const ctrl = new AbortController(); const tm = setTimeout(() => ctrl.abort(), 5000);
      try {
        const r = await fetch(url, { redirect: 'manual', signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0 SEVENCARGO' } });
        const loc = r.headers.get('location');
        if (loc) { url = new URL(loc, url).toString(); c = coordsFromText(decodeURIComponent(url)); }
        else { const body = (await r.text()).slice(0, 200000); c = coordsFromText(body); break; }
      } catch { break; } finally { clearTimeout(tm); }
    }
  }
  if (!c) throw bad('invalid_location');
  if (!inUAE(c.lat, c.lng)) throw bad('outside_service_area');
  return c;
}

// ---------- pricing ----------
function calcPrice(settings, { pickupEmirate, dropoffEmirate, km, weight, l, w, h, method }) {
  const P = settings.pricing;
  const em = P.emirates[pickupEmirate];
  if (!em || em.active === false) throw bad('emirate_not_served');
  const dem = P.emirates[dropoffEmirate];
  if (!dem || dem.active === false) throw bad('emirate_not_served');
  const r2 = (x) => Math.round(x * 100) / 100;
  const volumetric = (l * w * h) / (Number(P.vol_divisor) || 5000);
  const chargeable = Math.max(weight, volumetric);
  const base = Number(em.base) || 0;
  const extraKm = Math.max(0, km - (Number(P.included_km) || 0));
  const distance_fee = r2(extraKm * (Number(P.per_km) || 0));
  const extraKg = Math.max(0, Math.ceil(chargeable - (Number(P.included_kg) || 0)));
  const weight_fee = r2(extraKg * (Number(P.per_kg) || 0));
  const inter_emirate_fee = pickupEmirate !== dropoffEmirate ? Number(P.inter_emirate_fee) || 0 : 0;
  const cod_fee = method === 'online' ? 0 : Number(P.cod_fee) || 0;
  let subtotal = r2(base + distance_fee + weight_fee + inter_emirate_fee + cod_fee);
  const min = Number(P.min_price) || 0;
  if (subtotal < min) subtotal = min;
  const vat = r2(subtotal * (Number(P.vat_percent) || 0) / 100);
  const total = r2(subtotal + vat);
  return {
    base, distance_km: km, distance_fee, chargeable_kg: r2(chargeable), volumetric_kg: r2(volumetric),
    weight_fee, inter_emirate_fee, cod_fee, subtotal, vat_percent: Number(P.vat_percent) || 0, vat, total,
  };
}

// ---------- misc ----------
function genTrackingNo() {
  const n = crypto.randomInt(10000000, 99999999);
  return 'SC' + n;
}
function genCode() { return String(crypto.randomInt(1000, 10000)); }
function genPassword(len = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let s = ''; for (let i = 0; i < len; i++) s += chars[crypto.randomInt(chars.length)];
  return s;
}

module.exports = {
  HttpError, bad, wrap, COOKIES, SESSION_MS, IS_PROD,
  signToken, verifyToken, setAuthCookie, clearAuthCookie,
  loadAdmin, loadDriver, custOrders, requireAdmin, requireSuperAdmin, requireDriver, grantCustomer,
  str, num, optNum, phone, inUAE, emirateCode, saveDataUrl, parseLocation,
  haversineKm, roadDistanceKm, detectEmirate, resolvePoint, calcPrice,
  genTrackingNo, genCode, genPassword,
};
