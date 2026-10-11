-- Migration: Enhance Email Verifications
-- Description: Add attempt tracking and consumption flags for OTP security
--              Enables rate limiting, attempt limits, and replay attack prevention
-- Priority: MEDIUM
-- Date: 2026-10-10

-- Add attempt_count column to track verification attempts
ALTER TABLE email_verifications
  ADD COLUMN IF NOT EXISTS attempt_count INTEGER NOT NULL DEFAULT 0;

-- Add is_consumed flag to prevent replay attacks
ALTER TABLE email_verifications
  ADD COLUMN IF NOT EXISTS is_consumed BOOLEAN NOT NULL DEFAULT false;

-- Add last_sent_at to track when OTP was last sent (for rate limiting)
ALTER TABLE email_verifications
  ADD COLUMN IF NOT EXISTS last_sent_at timestamptz NULLABLE;

-- Add constraint to ensure attempt_count is non-negative
ALTER TABLE email_verifications
  ADD CONSTRAINT IF NOT EXISTS ev_attempt_check CHECK (attempt_count >= 0);

-- Rollback Instructions:
-- To rollback, run:
-- ALTER TABLE email_verifications DROP CONSTRAINT IF EXISTS ev_attempt_check;
-- ALTER TABLE email_verifications DROP COLUMN IF EXISTS attempt_count;
-- ALTER TABLE email_verifications DROP COLUMN IF EXISTS is_consumed;
-- ALTER TABLE email_verifications DROP COLUMN IF EXISTS last_sent_at;
