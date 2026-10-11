export declare class GuestService {
    /**
     * Register a guest attendee
     */
    register(params: {
        full_name: string;
        email: string;
        phone?: string;
    }): Promise<{
        attendee_id: number;
        full_name: string;
        email: string;
        email_verified: boolean;
    }>;
    /**
     * Send OTP to guest's email
     */
    sendOtp(attendeeId: number): Promise<void>;
    /**
     * Verify OTP and create guest session
     */
    verifyOtp(attendeeId: number, otp: string): Promise<{
        attendee_id: number;
        email_verified: boolean;
        session_token: string;
    }>;
    /**
     * Authenticate a guest by session token
     */
    authenticateSession(sessionToken: string): Promise<{
        attendeeId: number;
        email: string;
        sessionId: string;
    } | null>;
}
export declare const guestService: GuestService;
//# sourceMappingURL=guest.service.d.ts.map