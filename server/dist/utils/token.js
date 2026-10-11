import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
/**
 * Generate a cryptographically secure random token
 */
export function generateSecureToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex');
}
/**
 * Generate a JWT token for a user
 */
export function generateJwtToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    });
}
/**
 * Verify and decode a JWT token
 */
export function verifyJwtToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
}
/**
 * Generate a QR token for ticket check-in (32-byte hex)
 */
export function generateQrToken() {
    return crypto.randomBytes(32).toString('hex');
}
/**
 * Generate a ticket number in format TKT-XXXX
 */
export function generateTicketNumber() {
    const num = crypto.randomInt(1, 999999);
    return `TKT-${num.toString().padStart(6, '0')}`;
}
//# sourceMappingURL=token.js.map