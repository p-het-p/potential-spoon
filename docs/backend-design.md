# Backend Architecture Design

**Date:** 2026-10-10  
**Project:** Student Organization Management System Backend

---

## 1. Technology Stack

### 1.1 Core Technologies
- **Runtime:** Node.js (v18+ LTS)
- **Framework:** Express.js
- **Language:** TypeScript (for type safety and maintainability)
- **Database:** PostgreSQL (local, student_org database)
- **ORM:** Direct PostgreSQL with `pg` library (connection pooling)
- **Authentication:** Local password-based (initially), with Supabase Auth integration later
- **Payment Gateway:** Razorpay
- **Real-time:** Socket.IO
- **Validation:** Zod
- **Security:** Helmet, CORS, rate limiting (express-rate-limit)
- **Logging:** Winston or pino
- **Testing:** Jest + Supertest

### 1.2 Project Structure

```
server/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── config/
│   │   ├── env.ts             # Environment variable validation
│   │   └── database.ts        # PostgreSQL connection pool
│   ├── middleware/
│   │   ├── authenticate.ts   # Authentication middleware
│   │   ├── authorize.ts       # Role-based authorization
│   │   ├── validate.ts        # Request validation (Zod)
│   │   ├── rateLimit.ts       # Rate limiting
│   │   └── errorHandler.ts    # Centralized error handling
│   ├── routes/
│   │   ├── index.ts           # Route aggregation
│   │   ├── health.routes.ts   # Health check
│   │   ├── auth.routes.ts     # Local authentication
│   │   ├── profile.routes.ts  # User profile management
│   │   ├── events.routes.ts   # Event discovery and management
│   │   ├── products.routes.ts # Product catalog
│   │   ├── cart.routes.ts     # Cart management
│   │   ├── guest.routes.ts    # Guest identity and verification
│   │   ├── checkout.routes.ts # Checkout initiation
│   │   ├── orders.routes.ts   # Order management
│   │   ├── payments.routes.ts # Payment processing and webhooks
│   │   ├── tickets.routes.ts  # Ticket issuance and check-in
│   │   ├── memberships.routes.ts # Membership management
│   │   └── finance.routes.ts  # Treasurer financial reporting
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── profile.controller.ts
│   │   ├── events.controller.ts
│   │   ├── products.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── guest.controller.ts
│   │   ├── checkout.controller.ts
│   │   ├── orders.controller.ts
│   │   ├── payments.controller.ts
│   │   ├── tickets.controller.ts
│   │   ├── memberships.controller.ts
│   │   └── finance.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── profile.service.ts
│   │   ├── events.service.ts
│   │   ├── products.service.ts
│   │   ├── cart.service.ts
│   │   ├── guest.service.ts
│   │   ├── checkout.service.ts
│   │   ├── orders.service.ts
│   │   ├── payments.service.ts
│   │   ├── tickets.service.ts
│   │   ├── memberships.service.ts
│   │   ├── finance.service.ts
│   │   └── email.service.ts
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── event.repository.ts
│   │   ├── product.repository.ts
│   │   ├── cart.repository.ts
│   │   ├── order.repository.ts
│   │   ├── payment.repository.ts
│   │   ├── ticket.repository.ts
│   │   ├── membership.repository.ts
│   │   └── guest.repository.ts
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   ├── profile.schema.ts
│   │   ├── event.schema.ts
│   │   ├── product.schema.ts
│   │   ├── cart.schema.ts
│   │   ├── order.schema.ts
│   │   ├── payment.schema.ts
│   │   ├── ticket.schema.ts
│   │   └── membership.schema.ts
│   ├── integrations/
│   │   ├── razorpay.ts        # Razorpay SDK wrapper
│   │   ├── email.ts           # Email provider adapter
│   │   └── qr.ts              # QR code generation
│   ├── sockets/
│   │   ├── index.ts           # Socket.IO setup
│   │   ├── authentication.ts  # Socket authentication
│   │   └── events.ts          # Socket event handlers
│   ├── utils/
│   │   ├── password.ts         # Password hashing
│   │   ├── otp.ts             # OTP generation and hashing
│   │   ├── token.ts           # JWT token generation
│   │   └── transaction.ts     # Database transaction helper
│   └── types/
│       ├── express.d.ts       # Express type extensions
│       └── index.ts           # Shared type definitions
├── migrations/
│   ├── 001_fix_payments_constraint.sql
│   ├── 002_enhance_email_verifications.sql
│   ├── 003_add_guest_sessions.sql
│   └── 004_add_membership_plans_timestamps.sql
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 2. Database Relationship Map

```
┌─────────────────┐
│     users       │
│  (user_id: UUID)│
└────────┬────────┘
         │
         ├── memberships (user_id) ──┐
         │                           │
         ├── carts (user_id)          │
         │                           │
         ├── events (created_by)      │
         │                           │
         ├── orders (user_id)         │
         │                           │
         └── payments (user_id)       │
                                     │
┌─────────────────┐                  │
│membership_plans │                  │
│     (id: INT)   │◄─────────────────┘
└─────────────────┘

┌──────────────────────┐
│non_member_attendees   │
│ (attendee_id: BIGINT) │
└──────────┬───────────┘
           │
           ├── email_verifications (attendee_id)
           │
           ├── carts (attendee_id)
           │
           └── orders (attendee_id)

┌─────────────────┐
│     events      │
│   (id: BIGINT)  │
└────────┬────────┘
         │
         ├── products (event_id)
         │
         └── event_tickets (event_id)

┌─────────────────┐
│    products     │
│(product_id:BIGINT)│
└────────┬────────┘
         │
         ├── cart_items (product_id)
         │
         └── order_items (product_id)

┌─────────────────┐
│     carts       │
│  (cart_id:BIGINT)│
└────────┬────────┘
         │
         └── cart_items (cart_id)

┌─────────────────┐
│     orders      │
│ (order_id:BIGINT)│
└────────┬────────┘
         │
         ├── order_items (order_id)
         │
         ├── payments (order_id)
         │
         └── event_tickets (order_id)

┌─────────────────┐
│    payments     │
│   (id: BIGINT)  │
└─────────────────┘
│                 │
│ ─── Razorpay ───│
│                 │
└─────────────────┘
```

---

## 3. REST API Specification

### 3.1 Base URL
```
http://localhost:5000/api/v1
```

### 3.2 Common Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The supplied request is invalid",
    "details": []
  }
}
```

### 3.3 Authentication Endpoints (Local)

#### POST /auth/register
Register a new user with local password authentication.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "phone": "+919876543210"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "member"
  }
}
```

---

#### POST /auth/login
Authenticate with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": {
      "user_id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "member"
    }
  }
}
```

---

#### POST /auth/logout
Invalidate the current session.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 3.4 Profile Endpoints

#### GET /me
Get current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+919876543210",
    "role": "member",
    "created_at": "2026-10-10T00:00:00Z"
  }
}
```

---

#### PATCH /me/profile
Update current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "full_name": "John Updated",
  "phone": "+919876543211"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "email": "user@example.com",
    "full_name": "John Updated",
    "phone": "+919876543211",
    "role": "member"
  }
}
```

---

### 3.5 Events Endpoints

#### GET /events
List public events with pagination.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `search`: string (optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": 1,
        "title": "Tech Talk",
        "description": "About AI",
        "venue": "Auditorium",
        "starts_at": "2026-11-15T10:00:00Z",
        "ends_at": "2026-11-15T12:00:00Z",
        "capacity": 100,
        "seats_left": 75,
        "non_member_price": 50.00
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 10
    }
  }
}
```

---

#### GET /events/:eventId
Get event details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Tech Talk",
    "description": "About AI",
    "venue": "Auditorium",
    "starts_at": "2026-11-15T10:00:00Z",
    "ends_at": "2026-11-15T12:00:00Z",
    "capacity": 100,
    "is_public": true,
    "created_by": "uuid"
  }
}
```

---

#### POST /events (club_leader only)
Create a new event.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "title": "Workshop",
  "description": "React Workshop",
  "venue": "Lab 1",
  "starts_at": "2026-12-01T14:00:00Z",
  "ends_at": "2026-12-01T16:00:00Z",
  "capacity": 50,
  "is_public": true
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Workshop",
    "description": "React Workshop",
    "venue": "Lab 1",
    "starts_at": "2026-12-01T14:00:00Z",
    "ends_at": "2026-12-01T16:00:00Z",
    "capacity": 50,
    "is_public": true,
    "created_by": "uuid"
  }
}
```

---

### 3.6 Products Endpoints

#### GET /products
List available products.

**Query Parameters:**
- `type`: event_ticket | goodie | merchandise (optional)
- `event_id`: number (optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "product_id": 1,
        "name": "Event Ticket",
        "description": "Entry to event",
        "product_type": "event_ticket",
        "member_price": 30.00,
        "non_member_price": 50.00,
        "stock_quantity": null,
        "is_active": true,
        "event_id": 1
      }
    ]
  }
}
```

---

#### GET /products/:productId
Get product details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "name": "Event Ticket",
    "description": "Entry to event",
    "product_type": "event_ticket",
    "member_price": 30.00,
    "non_member_price": 50.00,
    "stock_quantity": null,
    "is_active": true,
    "event_id": 1
  }
}
```

---

### 3.7 Cart Endpoints

#### GET /cart
Get current user's cart.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "cart_id": 1,
    "status": "active",
    "items": [
      {
        "cart_item_id": 1,
        "product_id": 1,
        "name": "Event Ticket",
        "quantity": 2,
        "unit_price": 30.00,
        "total": 60.00
      }
    ],
    "total": 60.00
  }
}
```

---

#### POST /cart/items
Add item to cart.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "cart_item_id": 1,
    "product_id": 1,
    "quantity": 2,
    "unit_price": 30.00
  }
}
```

---

#### PATCH /cart/items/:cartItemId
Update cart item quantity.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "cart_item_id": 1,
    "quantity": 3,
    "unit_price": 30.00
  }
}
```

---

#### DELETE /cart/items/:cartItemId
Remove item from cart.

**Headers:** `Authorization: Bearer <token>`

**Response (204):** No content

---

### 3.8 Guest Endpoints

#### POST /guest/register
Register a guest attendee.

**Request:**
```json
{
  "full_name": "Guest User",
  "email": "guest@example.com",
  "phone": "+919876543210"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "attendee_id": 1,
    "full_name": "Guest User",
    "email": "guest@example.com",
    "email_verified": false
  }
}
```

---

#### POST /guest/send-otp
Send OTP verification code to guest email.

**Request:**
```json
{
  "attendee_id": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

#### POST /guest/verify-otp
Verify OTP code.

**Request:**
```json
{
  "attendee_id": 1,
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "attendee_id": 1,
    "email_verified": true,
    "session_token": "secure_token"
  }
}
```

---

### 3.9 Checkout Endpoints

#### POST /checkout/preview
Preview checkout with calculated totals.

**Headers:** `Authorization: Bearer <token>` (or guest session cookie)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "product_id": 1,
        "name": "Event Ticket",
        "quantity": 2,
        "unit_price": 30.00,
        "total": 60.00
      }
    ],
    "subtotal": 60.00,
    "total": 60.00,
    "currency": "INR"
  }
}
```

---

#### POST /checkout
Initiate checkout and create Razorpay order.

**Headers:** `Authorization: Bearer <token>` (or guest session cookie)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "order_id": 1,
    "razorpay_order_id": "order_xxxxx",
    "amount": 6000,
    "currency": "INR",
    "key": "rzp_test_xxxxx"
  }
}
```

---

### 3.10 Orders Endpoints

#### GET /orders
List user's orders.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `status`: pending | paid | failed | cancelled | refunded (optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "order_id": 1,
        "total_amount": 60.00,
        "currency": "INR",
        "status": "paid",
        "created_at": "2026-10-10T00:00:00Z",
        "completed_at": "2026-10-10T00:05:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5
    }
  }
}
```

---

#### GET /orders/:orderId
Get order details.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "order_id": 1,
    "total_amount": 60.00,
    "currency": "INR",
    "status": "paid",
    "created_at": "2026-10-10T00:00:00Z",
    "completed_at": "2026-10-10T00:05:00Z",
    "items": [
      {
        "order_item_id": 1,
        "product_id": 1,
        "product_name": "Event Ticket",
        "quantity": 2,
        "unit_price": 30.00,
        "total_price": 60.00
      }
    ]
  }
}
```

---

### 3.11 Payments Endpoints

#### POST /payments/verify
Verify Razorpay payment signature.

**Request:**
```json
{
  "order_id": 1,
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "xxxxx"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "payment_id": 1,
    "status": "successful",
    "order_id": 1
  }
}
```

---

#### POST /payments/razorpay/webhook
Razorpay webhook endpoint.

**Headers:** `X-Razorpay-Signature: <webhook_signature>`

**Request Body:** Raw Razorpay webhook payload

**Response (200):**
```json
{
  "success": true,
  "message": "Webhook processed"
}
```

---

### 3.12 Tickets Endpoints

#### GET /orders/:orderId/tickets
Get tickets for an order.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "ticket_id": 1,
        "ticket_number": "TKT-0001",
        "event_id": 1,
        "event_title": "Tech Talk",
        "status": "active",
        "issued_at": "2026-10-10T00:05:00Z"
      }
    ]
  }
}
```

---

#### POST /tickets/check-in
Check in a ticket by QR token.

**Headers:** `Authorization: Bearer <token>` (volunteer, club_leader, treasurer)

**Request:**
```json
{
  "qr_token": "xxxxx"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ticket_id": 1,
    "ticket_number": "TKT-0001",
    "event_title": "Tech Talk",
    "attendee_name": "John Doe",
    "status": "used",
    "checked_in_at": "2026-10-10T10:00:00Z"
  }
}
```

---

### 3.13 Memberships Endpoints

#### GET /membership-plans
List available membership plans.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": 1,
        "name": "Annual",
        "dues_amount": 500.00,
        "duration_days": 365,
        "is_active": true
      }
    ]
  }
}
```

---

#### GET /me/membership
Get current user's membership.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "active",
    "plan_name": "Annual",
    "start_date": "2026-01-01",
    "end_date": "2026-12-31"
  }
}
```

---

#### POST /memberships/checkout
Initiate membership checkout.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "plan_id": 1,
  "student_id": "STU12345",
  "department": "Computer Science"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "membership_id": 1,
    "razorpay_order_id": "order_xxxxx",
    "amount": 50000,
    "currency": "INR"
  }
}
```

---

### 3.14 Finance Endpoints (Treasurer Only)

#### GET /finance/summary
Get financial summary.

**Headers:** `Authorization: Bearer <token>` (treasurer only)

**Query Parameters:**
- `start_date`: date (optional)
- `end_date`: date (optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_revenue": 15000.00,
    "pending_payments": 2000.00,
    "failed_payments": 500.00,
    "refunded": 1000.00,
    "net_balance": 11500.00
  }
}
```

---

#### GET /finance/transactions
List financial transactions.

**Headers:** `Authorization: Bearer <token>` (treasurer only)

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `purpose`: ticket | membership_dues | merchandise (optional)
- `status`: pending | successful | failed | refunded (optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 1,
        "purpose": "ticket",
        "amount": 50.00,
        "status": "successful",
        "created_at": "2026-10-10T00:00:00Z",
        "paid_at": "2026-10-10T00:05:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100
    }
  }
}
```

---

### 3.15 Health Endpoint

#### GET /health
Health check endpoint.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-10-10T00:00:00Z",
    "database": "connected"
  }
}
```

---

## 4. WebSocket Event Specification

### 4.1 Connection Authentication

Socket connections must authenticate via JWT token or guest session token.

**Connection Query:**
```
?token=<jwt_token>
```

or

```
?guest_session=<session_token>
```

### 4.2 Events

#### order:status
Emitted when order status changes.

**Payload:**
```json
{
  "order_id": 1,
  "status": "paid",
  "updated_at": "2026-10-10T00:05:00Z"
}
```

**Rooms:** `user:<user_id>`, `guest:<attendee_id>`, `order:<order_id>`

---

#### payment:confirmed
Emitted when payment is successfully confirmed.

**Payload:**
```json
{
  "payment_id": 1,
  "order_id": 1,
  "amount": 60.00,
  "currency": "INR"
}
```

**Rooms:** `user:<user_id>`, `guest:<attendee_id>`, `order:<order_id>`

---

#### payment:failed
Emitted when payment fails.

**Payload:**
```json
{
  "payment_id": 1,
  "order_id": 1,
  "reason": "Payment declined"
}
```

**Rooms:** `user:<user_id>`, `guest:<attendee_id>`, `order:<order_id>`

---

#### ticket:issued
Emitted when tickets are issued.

**Payload:**
```json
{
  "order_id": 1,
  "ticket_count": 2,
  "event_id": 1
}
```

**Rooms:** `user:<user_id>`, `guest:<attendee_id>`, `order:<order_id>`

---

#### ticket:checked-in
Emitted when a ticket is checked in.

**Payload:**
```json
{
  "ticket_id": 1,
  "ticket_number": "TKT-0001",
  "event_id": 1,
  "checked_in_at": "2026-10-10T10:00:00Z"
}
```

**Rooms:** `event:<event_id>`, `role:club_leader`, `role:volunteer`

---

#### event:availability
Emitted when event availability changes.

**Payload:**
```json
{
  "event_id": 1,
  "seats_left": 50,
  "capacity": 100
}
```

**Rooms:** `event:<event_id>`, `role:club_leader`

---

#### finance:summary-updated
Emitted when financial summary changes.

**Payload:**
```json
{
  "total_revenue": 15000.00,
  "net_balance": 11500.00,
  "updated_at": "2026-10-10T00:05:00Z"
}
```

**Rooms:** `role:treasurer`

---

## 5. Payment State Transition Design

### 5.1 Payment Status Flow

```
pending
  │
  ├── successful (confirmed payment)
  │
  ├── failed (payment declined or error)
  │
  └── refunded (successful payment later refunded)
```

### 5.2 Order Status Flow

```
pending
  │
  ├── paid (payment successful)
  │
  ├── failed (payment failed)
  │
  ├── cancelled (user cancelled before payment)
  │
  └── refunded (paid order refunded)
```

### 5.3 Ticket Status Flow

```
active (issued after payment)
  │
  ├── used (checked in)
  │
  ├── cancelled (order cancelled)
  │
  └── refunded (order refunded)
```

### 5.4 State Transition Rules

1. **Pending → Successful/Failed**: Occurs after Razorpay signature verification
2. **Successful → Refunded**: Occurs after refund processing
3. **Failed → Pending**: Can retry payment for same order (if within retry window)
4. **Order Paid**: Only when payment status is successful
5. **Ticket Issuance**: Only after order status is paid
6. **Ticket Check-in**: Only for active tickets
7. **Check-in cannot be undone**: Once used, ticket cannot be unchecked

---

## 6. Inventory Reservation and Expiration Policy

### 6.1 Reservation Strategy

**Approach:** Optimistic locking with SELECT FOR UPDATE on products table during checkout.

**Flow:**
1. Begin transaction
2. SELECT product_id, stock_quantity FROM products WHERE product_id = $1 FOR UPDATE
3. Calculate required total quantity from cart
4. Check if stock_quantity >= required (or stock_quantity IS NULL for unlimited)
5. If insufficient, rollback and return error
6. If sufficient, proceed with order creation
7. Update stock_quantity: stock_quantity - required
8. Commit transaction

**Failure Handling:**
- If payment fails, restore stock_quantity in a compensating transaction
- If checkout times out, restore stock_quantity via cleanup job

### 6.2 Expiration Policy

**Unpaid Orders:** Orders in 'pending' status for more than 30 minutes are marked 'failed' and inventory is restored.

**Cleanup Job:**
- Runs every 5 minutes
- Finds orders with status 'pending' and created_at < now() - interval '30 minutes'
- Marks them as 'failed'
- Restores stock_quantity for all products in the order
- Emits payment:failed event

**Late Payment Handling:**
- If a successful payment webhook arrives after order expiration:
  - Do not issue tickets
  - Mark payment as 'failed' in database
  - Trigger refund through Razorpay API
  - Notify user via email

---

## 7. Role Permission Matrix

| Resource | Action | Member | Volunteer | Club Leader | Treasurer |
|----------|--------|--------|-----------|-------------|-----------|
| /me | GET | ✅ | ✅ | ✅ | ✅ |
| /me/profile | PATCH | ✅ | ✅ | ✅ | ✅ |
| /events | GET | ✅ | ✅ | ✅ | ✅ |
| /events | POST | ❌ | ❌ | ✅ | ❌ |
| /events/:id | PATCH | ❌ | ❌ | ✅ (own events) | ❌ |
| /products | GET | ✅ | ✅ | ✅ | ✅ |
| /cart | GET | ✅ | ❌ | ✅ | ❌ |
| /cart/items | POST | ✅ | ❌ | ✅ | ❌ |
| /checkout | POST | ✅ | ❌ | ✅ | ❌ |
| /orders | GET | ✅ (own) | ❌ | ✅ (all) | ✅ (all) |
| /finance/* | GET | ❌ | ❌ | ❌ | ✅ |
| /tickets/check-in | POST | ❌ | ✅ | ✅ | ✅ |
| /memberships | GET (own) | ✅ | ✅ | ✅ | ✅ |
| /roles | PATCH | ❌ | ❌ | ❌ | ❌ |

**Role Assignment Rules:**
- Only current club leaders can assign new club leaders (with capacity check)
- Only current treasurers can assign new treasurers (with capacity check)
- Club leaders can assign volunteers
- No self-assignment of elevated roles

---

## 8. Required Schema Migrations

Based on the database audit, the following migrations are required:

### 8.1 M001: Fix Payments Constraint (HIGH PRIORITY)

**File:** `migrations/001_fix_payments_constraint.sql`

```sql
-- Allow merchandise purpose without requiring membership_id
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_check;
ALTER TABLE payments ADD CONSTRAINT payments_check
  CHECK (
    (purpose = 'membership_dues' AND membership_id IS NOT NULL) OR
    (purpose IN ('ticket', 'merchandise'))
  );
```

**Reason:** Current constraint blocks merchandise payments in centralized order flow.

---

### 8.2 M002: Enhance Email Verifications (MEDIUM PRIORITY)

**File:** `migrations/002_enhance_email_verifications.sql`

```sql
-- Add attempt tracking and consumption flags for OTP security
ALTER TABLE email_verifications
  ADD COLUMN IF NOT EXISTS attempt_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_consumed BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_sent_at timestamptz NULLABLE;

ALTER TABLE email_verifications
  ADD CONSTRAINT IF NOT EXISTS ev_attempt_check CHECK (attempt_count >= 0);
```

**Reason:** Enables rate limiting, attempt limits, and replay attack prevention for guest OTP.

---

### 8.3 M003: Add Guest Sessions Table (MEDIUM PRIORITY)

**File:** `migrations/003_add_guest_sessions.sql`

```sql
-- Add secure session management for guests
CREATE TABLE IF NOT EXISTS guest_sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendee_id BIGINT NOT NULL,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gs_attendee_fkey FOREIGN KEY (attendee_id) 
    REFERENCES non_member_attendees(attendee_id) ON DELETE CASCADE,
  CONSTRAINT gs_expiry_check CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS idx_guest_sessions_token ON guest_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_guest_sessions_attendee ON guest_sessions(attendee_id);
CREATE INDEX IF NOT EXISTS idx_guest_sessions_expires_at ON guest_sessions(expires_at);
```

**Reason:** Provides secure guest session tokens instead of using sequential attendee_id.

---

### 8.4 M004: Add Membership Plans Timestamps (LOW PRIORITY)

**File:** `migrations/004_add_membership_plans_timestamps.sql`

```sql
-- Add audit timestamps to membership_plans
ALTER TABLE membership_plans
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
```

**Reason:** Enables tracking of plan changes for audit purposes.

---

### 8.5 M005: Cleanup Unused Enums (LOW PRIORITY)

**File:** `migrations/005_cleanup_unused_enums.sql`

```sql
-- Remove unused enums that don't match actual column constraints
DROP TYPE IF EXISTS ticket_audience;
DROP TYPE IF EXISTS ticket_status;
```

**Reason:** Removes dead code and confusion (ticket_status enum values don't match event_tickets.status CHECK constraint).

---

## 9. Security Considerations

### 9.1 Authentication
- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens with 1-hour expiration
- Refresh tokens with 7-day expiration
- Secure session cookies for guests (httpOnly, secure, sameSite)

### 9.2 Authorization
- Role-based access control enforced at middleware level
- Resource ownership checks (users can only access their own data)
- Event-level permissions for club leaders
- Treasurer-only access to financial endpoints

### 9.3 Input Validation
- All inputs validated with Zod schemas
- SQL injection prevention via parameterized queries
- XSS prevention via proper output encoding
- CSRF protection for cookie-based sessions

### 9.4 Rate Limiting
- Auth endpoints: 5 requests per minute per IP
- OTP send: 3 requests per 5 minutes per email
- Checkout: 10 requests per minute per user
- General API: 100 requests per minute per user

### 9.5 Payment Security
- Razorpay secrets in environment variables only
- Signature verification on server for all payments
- Webhook signature validation
- Idempotency keys for payment processing
- Never expose full payment details in logs

### 9.6 Data Protection
- PII redaction in logs
- Secure handling of OTP codes (hashed storage)
- QR tokens cryptographically generated (random 32-byte hex)
- No sequential IDs used as security credentials

---

## 10. Environment Variables

```dotenv
# Server
NODE_ENV=development
PORT=5000
API_BASE_PATH=/api/v1

# Database
DATABASE_URL=postgresql://postgres:Aksh@2006@localhost:5432/student_org

# JWT (for local authentication)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your-secret-key
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# Email (Nodemailer or SendGrid)
EMAIL_PROVIDER=nodemailer
EMAIL_FROM=noreply@studentorg.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Guest Sessions
GUEST_SESSION_SECRET=your-session-secret-min-32-chars
GUEST_OTP_SECRET=your-otp-secret-min-32-chars
GUEST_SESSION_EXPIRES_IN=24h

# CORS
APP_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=info
```

---

## 11. Testing Strategy

### 11.1 Unit Tests
- Repository layer (SQL queries)
- Service layer (business logic)
- Utility functions (password hashing, OTP generation)
- Schema validation

### 11.2 Integration Tests
- API endpoints with test database
- Authentication flow
- Authorization checks
- Payment processing (mocked Razorpay)
- WebSocket events

### 11.3 E2E Tests
- Complete user journey (register → login → purchase event → check-in)
- Guest purchase flow (register → verify OTP → purchase)
- Membership purchase flow
- Treasurer reporting

### 11.4 Test Database
- Separate test database: `student_org_test`
- Seeded with test data
- Reset between test runs

---

## 12. Deployment Considerations

### 12.1 Multi-Instance Deployment
- Socket.IO adapter for horizontal scaling (Redis adapter)
- Shared database connection pool
- Session storage in Redis
- Idempotent webhook processing

### 12.2 Database Backup
- Daily automated backups
- Point-in-time recovery enabled
- Migration rollback procedures documented

### 12.3 Monitoring
- Application logs (structured JSON)
- Database query performance
- API response times
- Payment success/failure rates
- WebSocket connection health

---

## 13. Known Limitations

1. **Expense Tracking:** No expense/reimbursement tables currently exist. Treasurer reports will only show revenue from tickets, memberships, and merchandise.

2. **Role Capacity Enforcement:** Role capacity limits (1-4 club leaders, 1-2 treasurers) are enforced in application logic, not database constraints.

3. **Inventory Reservations:** No dedicated reservation table; using optimistic locking on products table.

4. **Email Provider:** Configuration placeholder; actual provider setup required.

5. **Supabase Integration:** Initially implementing local authentication; Supabase Auth integration is a future phase.

---

## 14. Implementation Phases

1. **Phase 1:** Core infrastructure (database, auth middleware, validation)
2. **Phase 2:** Local authentication system
3. **Phase 3:** Core APIs (events, products, profiles, memberships)
4. **Phase 4:** Commerce APIs (carts, orders, checkout)
5. **Phase 5:** Guest email verification
6. **Phase 6:** Razorpay integration
7. **Phase 7:** Ticket issuance and check-in
8. **Phase 8:** WebSocket real-time features
9. **Phase 9:** Treasurer finance APIs
10. **Phase 10:** Testing and documentation
11. **Phase 11:** Supabase Auth integration (future)

---

This design document provides a complete blueprint for implementing the backend. All decisions are based on the actual database schema audit and align with the specified requirements.
