# Database Migrations

This directory contains SQL migrations for the Student Organization Management System database.

## Migration Files

| File | Priority | Description |
|------|----------|-------------|
| `001_fix_payments_constraint.sql` | HIGH | Allow merchandise payments in centralized order flow |
| `002_enhance_email_verifications.sql` | MEDIUM | Add OTP security features (attempt limits, consumption tracking) |
| `003_add_guest_sessions.sql` | MEDIUM | Add secure guest session management |
| `004_add_membership_plans_timestamps.sql` | LOW | Add audit timestamps to membership plans |
| `005_cleanup_unused_enums.sql` | LOW | Remove unused enum types |

## How to Apply Migrations

### Using pgAdmin

1. Open pgAdmin and connect to your PostgreSQL server
2. Navigate to the `student_org` database
3. Open the Query Tool (Tools > Query Tool)
4. For each migration file:
   - Open the `.sql` file in a text editor
   - Copy the SQL content
   - Paste into the Query Tool
   - Click Execute (F5)
   - Verify the output shows success
5. Migrations should be applied in numerical order (001, 002, 003, 004, 005)

### Using psql Command Line

```bash
# From the server directory
psql -U postgres -d student_org -f migrations/001_fix_payments_constraint.sql
psql -U postgres -d student_org -f migrations/002_enhance_email_verifications.sql
psql -U postgres -d student_org -f migrations/003_add_guest_sessions.sql
psql -U postgres -d student_org -f migrations/004_add_membership_plans_timestamps.sql
psql -U postgres -d student_org -f migrations/005_cleanup_unused_enums.sql
```

You will be prompted for the PostgreSQL password: `Aksh@2006`

### Apply All Migrations at Once

```bash
# From the server directory
for file in migrations/*.sql; do
  psql -U postgres -d student_org -f "$file"
done
```

## Migration Details

### 001: Fix Payments Constraint

**Problem:** The existing constraint blocks merchandise payments:
```sql
CHECK (
  (purpose = 'membership_dues' AND membership_id IS NOT NULL) OR
  (purpose = 'ticket')
)
```

**Solution:** Update to allow merchandise:
```sql
CHECK (
  (purpose = 'membership_dues' AND membership_id IS NOT NULL) OR
  (purpose IN ('ticket', 'merchandise'))
)
```

**Impact:** Enables centralized checkout with mixed product types (tickets + merchandise).

---

### 002: Enhance Email Verifications

**Problem:** No attempt tracking or consumption flags for guest OTP verification.

**Solution:** Add columns:
- `attempt_count`: Track verification attempts
- `is_consumed`: Prevent replay attacks
- `last_sent_at`: Enable rate limiting on OTP sending

**Impact:** Improves security of guest email verification with rate limits and replay protection.

---

### 003: Add Guest Sessions

**Problem:** No secure session mechanism for guests; sequential attendee_id is insecure.

**Solution:** Create `guest_sessions` table with:
- Cryptographically secure session tokens
- Expiration handling
- Fast lookup indexes

**Impact:** Provides secure guest authentication without exposing sequential IDs.

---

### 004: Add Membership Plans Timestamps

**Problem:** No audit trail for membership plan changes.

**Solution:** Add `created_at` and `updated_at` timestamps.

**Impact:** Enables tracking of when plans were created or modified.

---

### 005: Cleanup Unused Enums

**Problem:** Dead enum types that don't match actual column constraints:
- `ticket_status`: enum values (pending, confirmed, checked_in, cancelled) don't match CHECK constraint (active, used, cancelled, refunded)
- `ticket_audience`: not referenced by any column

**Solution:** Drop unused enum types.

**Impact:** Removes confusion and dead code from schema.

## Rollback Instructions

Each migration file includes rollback instructions in comments. To rollback a specific migration:

1. Open the migration file
2. Copy the SQL in the "Rollback Instructions" section
3. Execute in pgAdmin or psql
4. Rollback migrations in reverse order (005, 004, 003, 002, 001)

## Important Notes

- **High Priority Migrations (001)** should be applied before backend implementation begins
- **Medium Priority Migrations (002, 003)** should be applied before implementing guest features
- **Low Priority Migrations (004, 005)** can be applied anytime, but recommended before production
- All migrations are **additive or constraint updates** - no data is lost
- Migrations use `IF NOT EXISTS` and `IF EXISTS` for safe re-runs
- Always backup your database before applying migrations in production

## Verification

After applying migrations, verify the schema:

```sql
-- Check that guest_sessions table exists
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'guest_sessions';

-- Check email_verifications has new columns
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'email_verifications'
AND column_name IN ('attempt_count', 'is_consumed', 'last_sent_at');

-- Check payments constraint allows merchandise
SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint
WHERE conrelid = 'payments'::regclass AND conname = 'payments_check';
```

## Troubleshooting

### Migration 001 Fails: Constraint Not Found

If you get "constraint payments_check does not exist", check the actual constraint name:

```sql
SELECT conname FROM pg_constraint
WHERE conrelid = 'payments'::regclass AND contype = 'c';
```

Update the migration with the correct constraint name.

### Migration 003 Fails: Table Already Exists

If you get "relation guest_sessions already exists", you can skip this migration or manually drop and recreate:

```sql
DROP TABLE IF EXISTS guest_sessions CASCADE;
-- Then re-run the migration
```

### Migration 005 Fails: Type in Use

If you get "cannot drop type ticket_status because other objects depend on it", check dependencies:

```sql
SELECT * FROM pg_depend
WHERE refobjid = 'ticket_status'::regtype;
```

If the type is actually used, do not apply this migration.
