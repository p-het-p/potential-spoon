import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Generate a cryptographically secure random token
 */
export function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Generate a JWT token for a user
 */
export function generateJwtToken(payload: {
  userId: string;
  email: string;
  role: string;
}): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyJwtToken(token: string): {
  userId: string;
  email: string;
  role: string;
} {
  return jwt.verify(token, env.JWT_SECRET) as {
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * Generate a QR token for ticket check-in (32-byte hex)
 */
export function generateQrToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a ticket number in format TKT-XXXX
 */
export function generateTicketNumber(): string {
  const num = crypto.randomInt(1, 999999);
  return `TKT-${num.toString().padStart(6, '0')}`;
}
