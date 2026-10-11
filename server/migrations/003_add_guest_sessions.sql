-- Migration: Add Guest Sessions Table
-- Description: Add secure session management for guests
--              Provides cryptographically secure session tokens instead of sequential attendee_id
-- Priority: MEDIUM
-- Date: 2026-10-10

-- Create guest_sessions table
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

-- Create index on session_token for fast lookup during authentication
CREATE INDEX IF NOT EXISTS idx_guest_sessions_token ON guest_sessions(session_token);

-- Create index on attendee_id for user's session lookups
CREATE INDEX IF NOT EXISTS idx_guest_sessions_attendee ON guest_sessions(attendee_id);

-- Create index on expires_at for cleanup jobs (finding expired sessions)
CREATE INDEX IF NOT EXISTS idx_guest_sessions_expires_at ON guest_sessions(expires_at);

-- Rollback Instructions:
-- To rollback, run:
-- DROP INDEX IF EXISTS idx_guest_sessions_expires_at;
-- DROP INDEX IF EXISTS idx_guest_sessions_attendee;
-- DROP INDEX IF EXISTS idx_guest_sessions_token;
-- DROP TABLE IF EXISTS guest_sessions;
