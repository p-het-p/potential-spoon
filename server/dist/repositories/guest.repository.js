import { query } from '../config/database.js';
export class GuestRepository {
    // --- Non-member attendees ---
    async findAttendeeByEmail(email) {
        const result = await query('SELECT * FROM non_member_attendees WHERE email = $1', [email]);
        return result[0] || null;
    }
    async findAttendeeById(attendeeId) {
        const result = await query('SELECT * FROM non_member_attendees WHERE attendee_id = $1', [attendeeId]);
        return result[0] || null;
    }
    async createAttendee(params) {
        const result = await query(`INSERT INTO non_member_attendees (full_name, email, phone)
       VALUES ($1, $2, $3)
       RETURNING *`, [params.full_name, params.email, params.phone || null]);
        return result[0];
    }
    async markEmailVerified(attendeeId) {
        await query('UPDATE non_member_attendees SET email_verified = true WHERE attendee_id = $1', [attendeeId]);
    }
    // --- Email verifications ---
    async createEmailVerification(params) {
        const result = await query(`INSERT INTO email_verifications (attendee_id, otp_hash, expires_at, last_sent_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`, [params.attendee_id, params.otp_hash, params.expires_at]);
        return result[0];
    }
    async findLatestVerification(attendeeId) {
        const result = await query(`SELECT * FROM email_verifications
       WHERE attendee_id = $1 AND is_consumed = false AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`, [attendeeId]);
        return result[0] || null;
    }
    async incrementAttemptCount(verificationId) {
        await query('UPDATE email_verifications SET attempt_count = attempt_count + 1 WHERE id = $1', [verificationId]);
    }
    async consumeVerification(verificationId) {
        await query('UPDATE email_verifications SET is_consumed = true WHERE id = $1', [verificationId]);
    }
    async getRecentVerificationCount(attendeeId, windowMs) {
        const result = await query(`SELECT COUNT(*) as count FROM email_verifications
       WHERE attendee_id = $1 AND created_at > NOW() - INTERVAL '1 millisecond' * $2`, [attendeeId, windowMs]);
        return parseInt(result[0].count, 10);
    }
    // --- Guest sessions ---
    async createSession(params) {
        const result = await query(`INSERT INTO guest_sessions (attendee_id, session_token, expires_at)
       VALUES ($1, $2, $3)
       RETURNING *`, [params.attendee_id, params.session_token, params.expires_at]);
        return result[0];
    }
    async findSessionByToken(sessionToken) {
        const result = await query(`SELECT * FROM guest_sessions WHERE session_token = $1 AND expires_at > NOW()`, [sessionToken]);
        return result[0] || null;
    }
    async updateSessionLastUsed(sessionId) {
        await query('UPDATE guest_sessions SET last_used_at = NOW() WHERE session_id = $1', [sessionId]);
    }
    async deleteExpiredSessions() {
        await query('DELETE FROM guest_sessions WHERE expires_at < NOW()');
    }
}
export const guestRepository = new GuestRepository();
//# sourceMappingURL=guest.repository.js.map