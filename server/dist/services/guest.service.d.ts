export declare class GuestService {
    /**
     * Register a guest attendee
     */
    register(params: {
        full_name?: string;
        email: string;
        phone?: string;
    }): Promise<{
        attendee_id: number;
        full_name: string;
        email: string;
        email_verified: boolean;
        otp: string;
    }>;
    /**
     * Send OTP to guest's email
     */
    sendOtp(attendeeId?: number, email?: string): Promise<{
        attendee_id: number;
        otp: string;
    }>;
    /**
     * Verify OTP and create guest session
     */
    verifyOtp(attendeeId: number, otp: string): Promise<{
        attendee_id: number;
        full_name: string;
        email: string;
        email_verified: boolean;
        session_token: string;
        qr_token: string;
        qr_data_url: string | null;
    }>;
    /**
     * Get digital guest pass details
     */
    getPass(attendeeId: number): Promise<{
        attendee_id: number;
        full_name: string;
        email: string;
        phone: string | null;
        email_verified: boolean;
        qr_token: string;
        qr_data_url: string | null;
        issued_at: Date;
        status: string;
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