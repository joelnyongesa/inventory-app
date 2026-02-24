# Inventory App

A full-stack inventory management system built with **Laravel 12**, **React 18** (Inertia.js), and **Ant Design 6**.

## Tech Stack

| Layer        | Technology                                     |
|--------------|------------------------------------------------|
| Backend      | PHP 8.2, Laravel 12                            |
| Frontend     | React 18, Inertia.js, Ant Design 6, Tailwind  |
| Database     | SQLite (dev) — MySQL/PostgreSQL ready          |
| Session auth | Laravel Breeze (cookie-based sessions)         |
| API auth     | Laravel Sanctum (bearer tokens)                |

## Features

- **Products** — CRUD with SKU tracking, reorder-level alerts, active/inactive toggle
- **Orders** — Multi-line-item orders, status workflow (`pending → confirmed → fulfilled → cancelled`)
- **Dashboard** — Live KPIs, recent orders, low-stock alerts
- **Audit Log** — Every create/update/delete action recorded with user, action type, and JSON payload
- **REST API** — Stock check and order creation endpoints secured with Sanctum tokens
- **Flash Notifications** — Server-side flash messages surfaced as Ant Design toast notifications

---

## Setup

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+ / npm

### Installation

```bash
git clone <repo-url> inventory-app
cd inventory-app

# PHP dependencies
composer install

# JS dependencies
npm install

# Environment
cp .env.example .env
php artisan key:generate

# Database — migrations + demo seed data
php artisan migrate --seed

# Production build  (or use `npm run dev` below for HMR)
npm run build
```

### Run (development)

```bash
# Terminal 1 — Laravel dev server
php artisan serve

# Terminal 2 — Vite HMR
npm run dev
```

App is available at `http://localhost:8000`.

---

## Demo Credentials

| Field    | Value              |
|----------|--------------------|
| Email    | `test@example.com` |
| Password | `password`         |

The seeder also creates sample products and orders so the dashboard is populated on first load.

---

## Authorization

**Web routes** are protected by the `auth` + `verified` middleware group — unauthenticated requests redirect to `/login`.

**API routes** require a valid Sanctum bearer token (`auth:sanctum`) — unauthenticated calls receive `401 Unauthorized`.

```php
// routes/web.php
Route::middleware(['auth', 'verified'])->group(function () { ... });

// routes/api.php
Route::middleware('auth:sanctum')->group(function () { ... });
```

---

## API Authentication

### Generate a Sanctum token

```bash
php artisan tinker
```

```php
$user = App\Models\User::first();
echo $user->createToken('dev')->plainTextToken;
```

Copy the printed token and pass it as a bearer header on every API request.

---

## API Examples (curl)

### Check product stock by SKU

```bash
curl -s \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Accept: application/json" \
  http://localhost:8000/api/products/SKU-001
```

**Response 200:**

```json
{
  "data": {
    "id": 1,
    "name": "Widget A",
    "sku": "SKU-001",
    "price": 29.99,
    "stock_count": 45,
    "reorder_level": 10,
    "is_active": true,
    "is_low_stock": false
  }
}
```

**Response 404 (unknown SKU):**

```json
{ "message": "Product not found." }
```

---

### Create an order

```bash
curl -s -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Jane Doe",
    "phone": "+254712345678",
    "items": [
      { "product_id": 1, "quantity": 2 },
      { "product_id": 3, "quantity": 5 }
    ]
  }' \
  http://localhost:8000/api/orders
```

**Response 201 Created:**

```json
{
  "data": {
    "id": 42,
    "customer_name": "Jane Doe",
    "phone": "+254712345678",
    "status": "pending",
    "total": "209.85",
    "user": { "id": 1, "name": "Test User" },
    "items": [
      {
        "product": { "id": 1, "name": "Widget A", "sku": "SKU-001" },
        "quantity": 2,
        "unit_price": "29.99",
        "line_total": "59.98"
      },
      {
        "product": { "id": 3, "name": "Widget C", "sku": "SKU-003" },
        "quantity": 5,
        "unit_price": "29.99",
        "line_total": "149.95"
      }
    ]
  }
}
```

**Validation error 422:**

```json
{
  "message": "The customer name field is required.",
  "errors": {
    "customer_name": ["The customer name field is required."]
  }
}
```

---

## Flash Notifications

Flash messages are wired end-to-end with no extra client-side code required:

1. A controller sets a session flash: `->with('success', 'Order created.')` or `->with('error', '...')`
2. `HandleInertiaRequests::share()` forwards `flash.success` / `flash.error` to every Inertia response
3. `AppLayout.jsx` reads `usePage().props.flash` and fires an Ant Design `notification` toast

Any redirect that carries a flash key automatically shows a toast on the next page load.

---

## N+1 Query Protection

Eager loading is applied at every relationship boundary:

| Location | What is loaded | Why |
|----------|---------------|-----|
| `OrderController::index()` | `Order::with('user:id,name')` | Avoids N selects for the owner of each paginated row |
| `OrderController::show()` | `$order->load(['items.product:id,name,sku', 'user:id,name'])` | One query per relationship, not one per line item |
| `Api\OrderController::store()` | `$order->load(['items.product:id,name,sku', 'user:id,name'])` | Same pattern before JSON serialisation |
| `OrderService::createOrder()` | `Product::findMany($ids)->keyBy('id')` | Pre-loads all required products in one query **before** the loop — eliminates O(n) selects |

Column-constrained eager loads (e.g. `user:id,name`) also reduce data transfer from the database.

---

## Audit Log

Every mutating action writes a row to `audit_logs`:

| Action                 | Triggered in                      |
|------------------------|-----------------------------------|
| `product.created`      | `ProductController::store()`      |
| `product.updated`      | `ProductController::update()`     |
| `product.deleted`      | `ProductController::destroy()`    |
| `order.created`        | `OrderService::createOrder()`     |
| `order.status_updated` | `OrderController::update()`       |
| `order.deleted`        | `OrderController::destroy()`      |

Each row stores: `user_id`, `action`, `auditable_type`, `auditable_id`, and a `payload` JSON snapshot of the record at the time of the action.

Query recent audit entries in Tinker:

```bash
php artisan tinker
```

```php
App\Models\AuditLog::with('user:id,name')
    ->latest()
    ->limit(10)
    ->get(['id', 'user_id', 'action', 'auditable_type', 'auditable_id', 'created_at']);
```
