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
export declare class GuestRepository {
    findAttendeeByEmail(email: string): Promise<GuestAttendee | null>;
    findAttendeeById(attendeeId: number): Promise<GuestAttendee | null>;
    createAttendee(params: {
        full_name: string;
        email: string;
        phone?: string;
    }): Promise<GuestAttendee>;
    markEmailVerified(attendeeId: number): Promise<void>;
    createEmailVerification(params: {
        attendee_id: number;
        otp_hash: string;
        expires_at: Date;
    }): Promise<EmailVerification>;
    findLatestVerification(attendeeId: number): Promise<EmailVerification | null>;
    incrementAttemptCount(verificationId: number): Promise<void>;
    consumeVerification(verificationId: number): Promise<void>;
    getRecentVerificationCount(attendeeId: number, windowMs: number): Promise<number>;
    createSession(params: {
        attendee_id: number;
        session_token: string;
        expires_at: Date;
    }): Promise<GuestSession>;
    findSessionByToken(sessionToken: string): Promise<GuestSession | null>;
    updateSessionLastUsed(sessionId: string): Promise<void>;
    deleteExpiredSessions(): Promise<void>;
}
export declare const guestRepository: GuestRepository;
//# sourceMappingURL=guest.repository.d.ts.map