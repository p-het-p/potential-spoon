-- Migration: Fix Payments Constraint
-- Description: Allow merchandise purpose without requiring membership_id
--              This enables centralized order flow with mixed product types
-- Priority: HIGH
-- Date: 2026-10-10

-- Drop existing constraint
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_check;

-- Add updated constraint that allows ticket and merchandise purposes
-- without requiring membership_id
-- membership_dues still requires membership_id for audit trail
ALTER TABLE payments ADD CONSTRAINT payments_check
  CHECK (
    (purpose = 'membership_dues' AND membership_id IS NOT NULL) OR
    (purpose IN ('ticket', 'merchandise'))
  );

-- Rollback Instructions:
-- To rollback, run:
-- ALTER TABLE payments DROP CONSTRAINT payments_check;
-- ALTER TABLE payments ADD CONSTRAINT payments_check
--   CHECK (
--     (purpose = 'membership_dues' AND membership_id IS NOT NULL) OR
--     (purpose = 'ticket')
--   );
