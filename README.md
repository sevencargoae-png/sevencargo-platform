# SEVENCARGO

Pickup & delivery platform for the UAE (7 Emirates) — customer ordering with instant pricing, courier portal, operations dashboard, live tracking and chat.

## Stack
- Node.js + Express, Socket.IO (live tracking, chat, notifications)
- PostgreSQL (Render Postgres) — schema is created automatically on boot (`db.js`)
- Leaflet + OpenStreetMap (maps), OSRM (road distance, falls back to straight-line × 1.3), Nominatim (emirate detection)
- Stripe Checkout (optional online payment)

## Pages
| Path | Who |
|---|---|
| `/` | Landing page |
| `/order` | Customer creates a shipment (auto GPS location, photo, instant price, payment choice) |
| `/track` | Customer tracking by tracking number or phone — no account needed (live map, chat, rating, cancel) |
| `/complaints` | Customer complaints |
| `/admin` | Operations dashboard (sidebar): orders, assignment, live map, couriers, attendance, chats, complaints, ratings, cash, pricing, staff |
| `/driver` | Courier portal (mobile): check-in, accept/decline, pickup/delivery proof, incidents, chat |
| `/privacy`, `/terms`, `/cookies` | Legal |

## Environment variables
| Key | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | Render Postgres internal URL |
| `JWT_SECRET` | yes | long random string |
| `NODE_ENV` | yes | `production` |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | first boot | creates the first admin when no users exist |
| `PUBLIC_URL` | recommended | e.g. `https://sevencargo.online` (Stripe redirect URLs) |
| `CANONICAL_HOST` | optional | e.g. `sevencargo.online` — redirects `www.` to apex |
| `STRIPE_SECRET_KEY` | optional | enables online card payment |
| `STRIPE_WEBHOOK_SECRET` | optional | webhook `POST /api/stripe/webhook` (event `checkout.session.completed`) |

## Anti-tampering
- Price is always computed server-side; emirate detected from coordinates.
- Delivery requires the receiver's 4-digit code (never shown to the courier) + photo; repeated wrong codes flag the order.
- Pickup/delivery GPS must be within the geofence (default 500 m); outside requires a reason and flags the order for review.
- Cash collected is recorded automatically per courier and must be settled by operations.
- Full audit log per order (actor, time, coordinates). Separate JWT cookies per role (12 h), sessions revoked on password reset/suspension.

## Run locally
```bash
npm install
DATABASE_URL=postgres://user:pass@localhost:5432/sevencargo ADMIN_PASSWORD=ChangeMe123 node server.js
```
