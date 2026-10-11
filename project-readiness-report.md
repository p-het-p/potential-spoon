# Project Readiness Report

Date: 11 October 2026

## Executive summary

The client production build succeeds and PostgreSQL connectivity succeeds with the configured local environment. The backend previously could not compile, had no working automated tests, and exposed incomplete commerce and payment code. The compile blockers and cart API have now been repaired, and two automated cart-service tests are in place.

The application is **not ready for an end-to-end payment or ticketing release**. The biggest remaining risk is not the database connection; it is server functionality that is still stubbed or missing.

## Verification performed

| Check | Result | Notes |
|---|---|---|
| `server/npm run typecheck` | Pass | TypeScript compiles without errors. |
| `server/npm run build` | Pass | Backend output is generated. |
| `server/npm test` | Pass | 2 cart-service tests pass. |
| `client/npm run build` | Pass | Vite production build succeeds. |
| `client/npm run lint` | Pass with warnings | Several unused variables and React-pattern warnings remain. |
| PostgreSQL connection | Pass | The configured database accepts a read-only connection test. |

## Changes made

- Fixed backend imports that used `.ts` paths, which prevented NodeNext TypeScript builds.
- Replaced the empty cart service with cart ownership, inventory, pricing, quantity-limit, and authorization handling.
- Added `GET/POST/PATCH/DELETE /api/v1/cart` routes.
- Added `server/tests/cart.service.test.mjs` and made `npm test` build then run it.

## Findings to address next

### Blockers

1. **Payment flow is non-functional.** `payments.routes.ts` is empty, `payments.service.ts` only has an empty cleanup method, and `integrations/razorpay.ts` returns a dummy order. Checkout can therefore create database records with a fake payment-provider reference and cannot complete a real payment.

2. **Ticket input validation is effectively absent.** `checkInTicketSchema` is an empty Zod object. The check-in controller expects `qr_token`, but this schema neither requires nor validates it. Invalid requests can reach service/database code.

3. **No base database migration or migration runner exists.** The five SQL files alter an already-existing schema; they cannot create a fresh development database. New machines are therefore likely to fail with missing tables, types, or constraints. Add an initial schema migration and a repeatable command such as `npm run migrate`.

4. **Checkout mutates stock before a real payment has succeeded.** Inventory is deducted and the cart is marked checked out while creating the payment order. If payment is abandoned or fails, stock is not restored by the current code. Use an explicit pending reservation with expiry, then finalize it only after verified payment webhook handling.

### High priority

5. **Ticket access control is incomplete.** `getOrderTickets` does not verify that the requested order belongs to the authenticated user. A signed-in user can potentially enumerate order IDs and see another customer’s QR ticket credentials.

6. **The client API origin is hard-coded.** `client/src/lib/api.js` always calls `http://localhost:5000/api/v1`. A deployed client will continue to call the visitor’s own machine. Replace it with a `VITE_API_BASE_URL` environment variable and document it in a client `.env.example`.

7. **Secrets have been committed in the environment template/documentation.** The server template/README include a real-looking local database password. Rotate it, remove it from tracked files, and use neutral placeholders only. Confirm `.env` is ignored by Git.

8. **The deployed backend will terminate on an idle PostgreSQL pool error.** `database.ts` calls `process.exit(-1)` from the pool `error` listener. This turns a transient database/network fault into an outage. Log the event, expose an unhealthy health check, and rely on process supervision only if restart policy is deliberately configured.

### Medium priority

9. **The health endpoint returns HTTP 200 when the database is disconnected.** It reports `database: disconnected` in JSON but monitoring systems will still see success. Return 503 when database connectivity fails.

10. **Guest session handling is inconsistent.** The server authenticates guest sessions only from an `HttpOnly`-appropriate cookie named `guest_session`, whereas `verifyGuestOtp` returns the token in JSON and does not set that cookie. The client will therefore not become a recognized guest session without additional client-side unsafe handling.

11. **Socket initialization is still a TODO.** The server announces Socket.IO enabled, but its initializer is unimplemented. Either implement it or remove the claim until it is available.

12. **Lint output needs reduction.** The client has many warnings, including unused code and state updates inside effects. Remove obvious unused imports/variables first, then triage the shared UI library warnings separately from application warnings.

## Recommended work order

1. Add a clean, versioned database bootstrap migration and migration command; test it against an empty database.
2. Implement Razorpay order creation, signature-verified webhook handling, payment routes, and payment-failure stock recovery.
3. Fix ticket validation and authorization before exposing ticket APIs.
4. Move client/server URLs and secrets into environment-specific configuration.
5. Add integration tests for authentication, guest OTP cookie flow, cart, checkout rollback, payment verification, and ticket ownership.
6. Add CI that runs client build/lint and server typecheck/test for every change.

## Current practical conclusion

The database service is reachable, so server failures should now be investigated as application/migration/endpoint gaps rather than a basic database connection problem. Cart endpoints are implemented and covered by tests, but checkout, payments, and ticket handling must be completed before users can reliably buy or check in to anything.
