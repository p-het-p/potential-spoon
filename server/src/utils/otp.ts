import crypto from 'crypto';
import bcrypt from 'bcrypt';
import logger from './logger.js';

const OTP_LENGTH = 6;
const SALT_ROUNDS = 10;

/**
 * Generate a secure random OTP code
 */
export function generateOtp(): string {
  const min = Math.pow(10, OTP_LENGTH - 1);
  const max = Math.pow(10, OTP_LENGTH) - 1;
  const otp = crypto.randomInt(min, max + 1);
  return otp.toString();
}

/**
 * Hash an OTP for secure storage
 */
export async function hashOtp(otp: string): Promise<string> {
  try {
    return await bcrypt.hash(otp, SALT_ROUNDS);
  } catch (error) {
    logger.error('OTP hashing failed', error);
    throw new Error('Failed to hash OTP');
  }
}

/**
 * Verify an OTP against its hash
 */
export async function verifyOtp(otp: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(otp, hash);
  } catch (error) {
    logger.error('OTP verification failed', error);
    return false;
  }
}

/**
 * Parse a duration string (e.g., '10m', '1h', '24h') to milliseconds
 */
export function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)(m|h|d)$/);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: throw new Error(`Invalid duration unit: ${unit}`);
  }
}
