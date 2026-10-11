-- Migration: Add Membership Plans Timestamps
-- Description: Add audit timestamps to membership_plans table
--              Enables tracking of plan changes for audit purposes
-- Priority: LOW
-- Date: 2026-10-10

-- Add created_at timestamp
ALTER TABLE membership_plans
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

-- Add updated_at timestamp
ALTER TABLE membership_plans
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Rollback Instructions:
-- To rollback, run:
-- ALTER TABLE membership_plans DROP COLUMN IF EXISTS created_at;
-- ALTER TABLE membership_plans DROP COLUMN IF EXISTS updated_at;
