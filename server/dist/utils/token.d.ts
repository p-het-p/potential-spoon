/**
 * Generate a cryptographically secure random token
 */
export declare function generateSecureToken(bytes?: number): string;
/**
 * Generate a JWT token for a user
 */
export declare function generateJwtToken(payload: {
    userId: string;
    email: string;
    role: string;
}): string;
/**
 * Verify and decode a JWT token
 */
export declare function verifyJwtToken(token: string): {
    userId: string;
    email: string;
    role: string;
};
/**
 * Generate a QR token for ticket check-in (32-byte hex)
 */
export declare function generateQrToken(): string;
/**
 * Generate a ticket number in format TKT-XXXX
 */
export declare function generateTicketNumber(): string;
//# sourceMappingURL=token.d.ts.map