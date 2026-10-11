# Student Organization Management System - Backend

Backend API for the Student Organization Management System built with Node.js, Express, TypeScript, and PostgreSQL.

## Current Status

**Phase 4 & 5 Complete:**
- ✅ Core infrastructure (environment configuration, database connection, middleware)
- ✅ Local authentication system (register, login, logout)
- ✅ Profile management (get/update profile)
- ✅ Health check endpoint

**Remaining Phases:**
- ⏳ Core application APIs (events, products, memberships, carts, orders)
- ⏳ Guest email verification with OTP
- ⏳ Razorpay payment integration
- ⏳ Ticket issuance and QR check-in
- ⏳ WebSocket real-time features
- ⏳ Treasurer finance APIs
- ⏳ Automated tests
- ⏳ Final documentation

## Prerequisites

- Node.js (v18+)
- PostgreSQL (running locally on port 5432)
- Database: `student_org`
- Database user: `postgres`
- Database password: `Aksh@2006`

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration. The current `.env` is configured for local development.

4. Apply database migrations (optional but recommended):
```bash
# Using psql
psql -U postgres -d student_org -f migrations/001_fix_payments_constraint.sql
psql -U postgres -d student_org -f migrations/002_enhance_email_verifications.sql
psql -U postgres -d student_org -f migrations/003_add_guest_sessions.sql
psql -U postgres -d student_org -f migrations/004_add_membership_plans_timestamps.sql
psql -U postgres -d student_org -f migrations/005_cleanup_unused_enums.sql
```

See `migrations/README.md` for detailed migration instructions.

## Running the Server

### Development Mode
```bash
npm run dev
```

The server will:
- Start on port 5000
- Watch for file changes and auto-restart
- Log to console and `logs/app.log`

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
```
GET /api/v1/health
```

Returns server status and database connection.

### Authentication
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
```

**Register:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "full_name": "John Doe",
    "phone": "+919876543210"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### Profile
```
GET /api/v1/me
PATCH /api/v1/me/profile
```

Requires `Authorization: Bearer <token>` header.

**Get Profile:**
```bash
curl http://localhost:5000/api/v1/me \
  -H "Authorization: Bearer <your-token>"
```

**Update Profile:**
```bash
curl -X PATCH http://localhost:5000/api/v1/me/profile \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Updated",
    "phone": "+919876543211"
  }'
```

## Project Structure

```
server/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── config/
│   │   ├── env.ts             # Environment variable validation
│   │   └── database.ts        # PostgreSQL connection pool
│   ├── middleware/
│   │   ├── authenticate.ts   # JWT authentication
│   │   ├── authorize.ts       # Role-based authorization
│   │   ├── validate.ts        # Request validation (Zod)
│   │   ├── rateLimit.ts       # Rate limiting
│   │   └── errorHandler.ts    # Centralized error handling
│   ├── routes/
│   │   ├── health.routes.ts   # Health check
│   │   ├── auth.routes.ts     # Authentication
│   │   └── profile.routes.ts  # Profile management
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── profile.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── profile.service.ts
│   ├── repositories/
│   │   └── user.repository.ts
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   └── profile.schema.ts
│   └── utils/
│       ├── logger.ts          # Winston logger
│       └── password.ts        # Password hashing
├── migrations/                # SQL migrations
├── tests/                     # Test files (to be added)
├── .env.example              # Environment template
├── .env                      # Environment configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables

See `.env.example` for all available variables. Key variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT token signing (min 32 chars)
- `RAZORPAY_KEY_ID`: Razorpay API key
- `RAZORPAY_KEY_SECRET`: Razorpay secret key
- `EMAIL_FROM`: Sender email for notifications

## Database Schema

The database schema is documented in `../docs/database-audit.md`.

Key tables:
- `users`: User accounts with local authentication
- `events`: Event information
- `products`: Products (tickets, merchandise)
- `carts` / `cart_items`: Shopping cart
- `orders` / `order_items`: Orders
- `payments`: Payment records with Razorpay fields
- `event_tickets`: Issued tickets with QR codes
- `memberships` / `membership_plans`: Membership management
- `non_member_attendees`: Guest attendees
- `email_verifications`: Guest OTP verification

## Security Features

- Password hashing with bcrypt (cost factor 12)
- JWT token authentication with expiration
- Rate limiting on sensitive endpoints
- Input validation with Zod
- SQL injection prevention via parameterized queries
- CORS configuration
- Helmet security headers
- Sensitive data redaction in logs

## Testing

Tests will be added in Phase 11. Run tests with:
```bash
npm test
```

## Logging

Logs are written to:
- Console (development mode)
- `logs/app.log` (all logs)
- `logs/app-error.log` (error logs only)

Log level is controlled by `LOG_LEVEL` environment variable.

## Troubleshooting

### Database Connection Failed
- Ensure PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in `.env`
- Verify database exists: `psql -U postgres -l`

### Port Already in Use
- Check what's using port 5000: `netstat -ano | findstr :5000` (Windows)
- Change PORT in `.env`

### Environment Variable Errors
- Ensure `.env` file exists
- Copy from `.env.example` and fill in values
- Check that secrets are at least 32 characters

## Development Notes

- The server uses TypeScript with strict mode enabled
- ES modules are used (`"type": "module"`)
- File extensions are required in imports (`.js`)
- `tsx watch` is used for development with hot reload

## Next Steps

1. Apply database migrations from `migrations/` directory
2. Implement events and products APIs
3. Implement cart and order management
4. Implement guest email verification
5. Integrate Razorpay payments
6. Implement ticket issuance and check-in
7. Add WebSocket support
8. Implement treasurer finance APIs
9. Write comprehensive tests
10. Complete documentation

## Documentation

- [Database Audit](../docs/database-audit.md) - Complete schema analysis
- [Backend Design](../docs/backend-design.md) - Architecture and API specification
- [Migrations README](migrations/README.md) - Database migration guide

## License

ISC
