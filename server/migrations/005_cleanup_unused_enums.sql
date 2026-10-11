-- Migration: Cleanup Unused Enums
-- Description: Remove unused enums that don't match actual column constraints
--              ticket_status enum values don't match event_tickets.status CHECK constraint
--              ticket_audience enum is not referenced by any column
-- Priority: LOW
-- Date: 2026-10-10

-- Note: Drop these enums only if they are confirmed to be unused
-- The event_tickets.status column uses varchar with CHECK constraint:
--   CHECK (status::text = ANY ((ARRAY['active'::character varying, 'used'::character varying,
--   'cancelled'::character varying, 'refunded'::character varying])::text[]))
-- The ticket_status enum has different values: pending, confirmed, checked_in, cancelled

-- Drop unused ticket_audience enum
DROP TYPE IF EXISTS ticket_audience;

-- Drop unused ticket_status enum
DROP TYPE IF EXISTS ticket_status;

-- Rollback Instructions:
-- To rollback (if these enums are actually needed), run:
-- CREATE TYPE ticket_audience AS ENUM ('member', 'non_member');
-- CREATE TYPE ticket_status AS ENUM ('pending', 'confirmed', 'checked_in', 'cancelled');
