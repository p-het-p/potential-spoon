/**
 * Generate a secure random OTP code
 */
export declare function generateOtp(): string;
/**
 * Hash an OTP for secure storage
 */
export declare function hashOtp(otp: string): Promise<string>;
/**
 * Verify an OTP against its hash
 */
export declare function verifyOtp(otp: string, hash: string): Promise<boolean>;
/**
 * Parse a duration string (e.g., '10m', '1h', '24h') to milliseconds
 */
export declare function parseDuration(duration: string): number;
//# sourceMappingURL=otp.d.ts.map