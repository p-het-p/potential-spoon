# Missing Features, Errors, and Route Audit

Reviewed: 11 October 2026

## Current state

The frontend production build and backend TypeScript build pass, and the local PostgreSQL server accepts connections. This does **not** mean the app is release-ready: several routes are empty, some user flows do not have a corresponding backend capability, and a few data/security defects can expose information or create incorrect records.

## Critical: address before real users

| Finding | Evidence | Impact | Required action |
|---|---|---|---|
| Direct payment is not a real payment | `checkout.service.ts` marks any selected method successful without provider confirmation. | Anyone can self-confirm a cash/UPI/card/bank-transfer order. Financial data and inventory are inaccurate. | Keep this only for a demo. For production, use a verified provider callback or a staff-only cash-payment confirmation route. |
| Ticket validation accepts any body | `schemas/ticket.schema.ts` is an empty Zod object, while the controller expects `qr_token`. | Missing/invalid QR tokens pass validation and reach business logic. | Require a non-empty bounded `qr_token` string. |
| Order/ticket ownership is incomplete | `orders.service.ts` only blocks a user when their role is exactly `member`; `tickets.service.ts` never checks ownership. | Volunteers can view arbitrary orders; any authenticated user can request QR tokens for another order by guessing its ID. | Enforce owner access for every non-staff role. Apply the same rule to `/orders/:orderId/tickets`. Never return raw QR credentials to unauthorized callers. |
| Guest checkout has no order-history route | `/orders` uses JWT authentication only; the frontend order pages require a member token. | Guest buyers can pay but cannot retrieve their confirmed order/tickets after redirect or refresh. | Add guest-aware order lookup authenticated by the guest-session cookie, or show a signed order-retrieval token. |
| Checkout payment-purpose logic loses mixed carts | Checkout labels every cart that is not exclusively merchandise as `ticket`. | Finance reports cannot accurately classify mixed ticket/merchandise payments. | Introduce an `order` purpose or split one payment into correctly classified payment lines. |

## Missing server features and disconnected routes

| Area | Missing or disconnected item | Evidence |
|---|---|---|
| Payments | No endpoints exist under `/api/v1/payments`. | `routes/payments.routes.ts` contains only a TODO, although `app.ts` mounts it and the client/payment repository contain payment concepts. |
| Payment lifecycle | No payment verification, refund, failure, cancellation, receipt, or staff cash-confirmation flow. | `payments.service.ts` only has an empty cleanup method; Razorpay is intentionally disabled. |
| Orders | There is no staff route for `OrderService.getAllOrders()`. | The service/repository support listing all orders, but `orders.routes.ts` exposes only member endpoints. |
| Products | Products are read-only. | `products.routes.ts` has GET routes only; leaders cannot create, edit, deactivate, price, or stock products from the app. |
| Memberships | Joining creates a `pending` membership but there is no UI/API payment, approval, activation, cancellation, renewal, or plan-management route. | `MembershipService.activateMembership()` is not connected to a route. |
| Tickets | No ticket reissue, cancellation/refund, QR image endpoint, scan-camera feature, or attendee lookup. | Only manual `POST /tickets/check-in` exists. |
| Notifications | Confirmation and ticket email functions are implemented but never called during checkout. | `integrations/email.ts` provides them; `checkout.service.ts` does not use them. |
| Realtime | Socket.IO is announced during startup but has no behavior. | `sockets/index.ts` is a TODO. |
| Password/account recovery | No forgot-password, reset-password, email verification for members, refresh token, token revocation, or account deletion endpoints. | `auth.routes.ts` only exposes register/login/logout. |
| Public content | Database supports announcements and club information, but no API or UI routes expose them. | Tables exist; no matching routes/controllers/services were found. |
| Event management | Only `club_leader` may manage events. The frontend correctly hides management from treasurers, but the project has no documented workflow for assigning club-leader roles. | `clubLeaderOnly` is used for all write operations and registration always creates `member` users. |

## Route and data mismatches

| Finding | Impact |
|---|---|
| Stale Razorpay comments/configuration remain in `app.ts`, `checkout.routes.ts`, `config/env.ts`, `payment.schema.ts`, and `payment.repository.ts`. | Confusing operational setup; obsolete credentials and types can be accidentally reused. |
| `payment.schema.ts` validates Razorpay fields but is not mounted by any route. | Dead code indicates an incomplete payment flow. |
| `ticket.repository.ts` was updated to `event_tickets`, but all ticket paths need integration tests against the actual schema. | The table-name mismatch was previously a runtime defect; other schema drift may remain. |
| `sendOrderConfirmationEmail()` divides the amount by 100, while checkout totals are in rupees. | When connected, order emails would show a value 100 times too small. |
| The event list query returns only public future events. | The leader management page uses that same endpoint, so it cannot list past or private events to edit/delete. |
| `GET /events/:id` is public without checking `is_public`. | Private events are discoverable by ID. |
| Event update/delete checks role but not event ownership. | Every club leader can modify/delete another leader’s event. |
| Health check returns HTTP 200 even when the database is unavailable. | Load balancers and uptime checks can treat a broken server as healthy. |
| An idle pool error calls `process.exit(-1)`. | A temporary PostgreSQL/network problem causes an avoidable full server outage. |

## Database and operational gaps

- There is no initial schema migration or migration runner. Existing migration files alter an assumed database, so a fresh environment cannot be reproduced reliably.
- Migrations must be applied manually and there is no `schema_migrations` tracking table.
- No seed data exists for development/test roles, membership plans, events, or products.
- No automated database integration test exercises registration → cart → checkout → ticket issuance → check-in.
- Inventory is decremented permanently when the demo checkout succeeds; there is no cancellation/refund stock-restoration workflow.
- No scheduled cleanup exists for expired OTP records, expired guest sessions, abandoned carts, or stale orders. The configured cleanup service is empty.
- Secrets/configuration remain more extensive than needed for the current no-gateway mode; remove unused payment credentials from runtime configuration when appropriate.

## Frontend gaps

- Guest users can add to cart and complete checkout, but cannot open their order or ticket screen afterwards because those screens require a member JWT.
- No product-management screen exists, so products/tickets must be inserted directly in the database.
- No UI handles payment failure, refund, cancellation, order recovery, or receipt downloads.
- QR tokens are shown only as a shortened text value, not as scannable QR imagery.
- No role-denied/not-authorized page or consistent error boundary exists.
- Client lint still reports warnings, particularly in imported `control-ui` components and a small number of application hooks. The build succeeds, but warnings should be triaged before release.

## Recommended delivery order

1. Fix authorization and validation: order/ticket ownership, ticket schema, private-event visibility, and event ownership.
2. Decide whether the current local “always successful” payment flow is demo-only. If yes, label it clearly and add staff confirmation for non-demo data; if no, implement provider verification before accepting money.
3. Add guest order/ticket retrieval and send confirmation/ticket emails after successful checkout.
4. Build the missing product, payment, membership activation, and staff-order routes/UI.
5. Add a baseline migration, migration runner, seed data, and database-backed end-to-end tests.
6. Implement cancellation/refund and stock restoration, then add scheduled cleanup and reliable health behavior.
