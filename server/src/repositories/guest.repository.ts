import { query } from '../config/database.js';

export interface GuestAttendee {
  attendee_id: number;
  full_name: string;
  email: string;
  phone: string | null;
  email_verified: boolean;
  registered_at: Date;
}

export interface EmailVerification {
  verification_id: number;
  attendee_id: number;
  otp_hash: string;
  expires_at: Date;
  attempt_count: number;
  is_consumed: boolean;
  last_sent_at: Date | null;
  created_at: Date;
}

export interface GuestSession {
  session_id: string;
  attendee_id: number;
  session_token: string;
  expires_at: Date;
  created_at: Date;
  last_used_at: Date;
}

export class GuestRepository {
  // --- Non-member attendees ---

  async findAttendeeByEmail(email: string): Promise<GuestAttendee | null> {
    const result = await query<GuestAttendee>(
      'SELECT * FROM non_member_attendees WHERE email = $1',
      [email]
    );
    return result[0] || null;
  }

  async findAttendeeById(attendeeId: number): Promise<GuestAttendee | null> {
    const result = await query<GuestAttendee>(
      'SELECT * FROM non_member_attendees WHERE attendee_id = $1',
      [attendeeId]
    );
    return result[0] || null;
  }

  async createAttendee(params: {
    full_name: string;
    email: string;
    phone?: string;
  }): Promise<GuestAttendee> {
    const result = await query<GuestAttendee>(
      `INSERT INTO non_member_attendees (full_name, email, phone)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [params.full_name, params.email, params.phone || null]
    );
    return result[0];
  }

  async markEmailVerified(attendeeId: number): Promise<void> {
    await query(
      'UPDATE non_member_attendees SET email_verified = true WHERE attendee_id = $1',
      [attendeeId]
    );
  }

  // --- Email verifications ---

  async createEmailVerification(params: {
    attendee_id: number;
    otp_hash: string;
    expires_at: Date;
  }): Promise<EmailVerification> {
    const result = await query<EmailVerification>(
      `INSERT INTO email_verifications (attendee_id, otp_hash, expires_at, last_sent_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [params.attendee_id, params.otp_hash, params.expires_at]
    );
    return result[0];
  }

  async findLatestVerification(attendeeId: number): Promise<EmailVerification | null> {
    const result = await query<EmailVerification>(
      `SELECT * FROM email_verifications
       WHERE attendee_id = $1 AND is_consumed = false AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [attendeeId]
    );
    return result[0] || null;
  }

  async incrementAttemptCount(verificationId: number): Promise<void> {
    await query(
      'UPDATE email_verifications SET attempt_count = attempt_count + 1 WHERE verification_id = $1',
      [verificationId]
    );
  }

  async consumeVerification(verificationId: number): Promise<void> {
    await query(
      'UPDATE email_verifications SET is_consumed = true, verified_at = NOW() WHERE verification_id = $1',
      [verificationId]
    );
  }

  async getRecentVerificationCount(attendeeId: number, windowMs: number): Promise<number> {
    const result = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM email_verifications
       WHERE attendee_id = $1 AND created_at > NOW() - INTERVAL '1 millisecond' * $2`,
      [attendeeId, windowMs]
    );
    return parseInt(result[0].count, 10);
  }

  // --- Guest sessions ---

  async createSession(params: {
    attendee_id: number;
    session_token: string;
    expires_at: Date;
  }): Promise<GuestSession> {
    const result = await query<GuestSession>(
      `INSERT INTO guest_sessions (attendee_id, session_token, expires_at)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [params.attendee_id, params.session_token, params.expires_at]
    );
    return result[0];
  }

  async findSessionByToken(sessionToken: string): Promise<GuestSession | null> {
    const result = await query<GuestSession>(
      `SELECT * FROM guest_sessions WHERE session_token = $1 AND expires_at > NOW()`,
      [sessionToken]
    );
    return result[0] || null;
  }

  async updateSessionLastUsed(sessionId: string): Promise<void> {
    await query(
      'UPDATE guest_sessions SET last_used_at = NOW() WHERE session_id = $1',
      [sessionId]
    );
  }

  async deleteExpiredSessions(): Promise<void> {
    await query('DELETE FROM guest_sessions WHERE expires_at < NOW()');
  }
}

export const guestRepository = new GuestRepository();
