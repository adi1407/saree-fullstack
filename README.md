# AADIORA — Curated Handwoven Sarees

Full-stack saree e-commerce platform with Next.js frontend and Express + MongoDB backend.

## Project Structure

```
shop/
├── frontend/     # Next.js 16 App Router
├── backend/      # Express 5 + Mongoose API
├── docker-compose.yml
└── .env.example
```

## Quick Start

### 1. Environment

```bash
cp .env.example .env
cp frontend/.env.local.example frontend/.env.local
```

### 2. Start MongoDB (Docker)

```bash
docker compose up mongo -d
```

### 3. Backend

```bash
cd backend
npm run dev
npm run seed    # seed demo data
```

API runs at http://localhost:4001

**Demo accounts after seed:**
- Admin: `admin@sareeshop.com` / `password123`
- Customer: `demo@sareeshop.com` / `password123`

### 4. Frontend

```bash
cd frontend
npm run dev
```

Store at http://localhost:3000

## Features

- Royal Heritage design system (Cormorant + DM Sans)
- Home, PLP, PDP with 360° turntable view + image zoom
- JWT auth (account required for cart/checkout)
- Cart with qty update and remove
- Checkout with shipping address + Razorpay (dev mock when keys missing)
- Order history and tracking
- Account page with saved addresses
- Admin: saree CRUD, order management, dashboard stats
- Shiprocket integration (mock AWB when credentials missing)

## Test Checkout (Dev Mock)

Without Razorpay keys, the backend runs in **mock payment mode**:

1. Login as `demo@sareeshop.com` / `password123`
2. Add a saree to cart → proceed to checkout
3. Enter shipping address → Continue to Payment
4. Click **Complete Order** (simulated payment)
5. View order at `/orders` with mock tracking AWB

Seed also creates 2 sample orders for the demo customer.

## Payment Setup (Razorpay)

Add to `.env`:

```
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

Add to `frontend/.env.local`:

```
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
```

Production webhook URL: `https://your-api.com/api/webhooks/razorpay`

## Shipping Setup (Shiprocket)

Add to `.env`:

```
SHIPROCKET_EMAIL=your@email.com
SHIPROCKET_PASSWORD=...
SHIPROCKET_PICKUP_LOCATION=Primary
```

Without these, mock AWB codes are generated automatically on payment.

## API Routes

| Area | Endpoints |
|------|-----------|
| Auth | `/api/auth/register`, `/login`, `/logout`, `/me`, `/addresses` |
| Sarees | `/api/sarees`, `/api/sarees/:slug` |
| Cart | `/api/cart`, `/api/cart/items` |
| Checkout | `/api/checkout/create`, `/verify`, `/mock-pay` |
| Orders | `/api/orders`, `/api/orders/:id` |
| Admin | `/api/admin/sarees`, `/api/admin/orders`, `/api/admin/stats` |
| Webhooks | `/api/webhooks/razorpay` |
