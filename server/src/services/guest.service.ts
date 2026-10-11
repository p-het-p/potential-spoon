import { guestRepository } from '../repositories/guest.repository.js';
import { generateOtp, hashOtp, verifyOtp, parseDuration } from '../utils/otp.js';
import { generateSecureToken } from '../utils/token.js';
import { sendOtpEmail } from '../integrations/email.js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

export class GuestService {
  /**
   * Register a guest attendee
   */
  async register(params: { full_name?: string; email: string; phone?: string }) {
    const fullName = params.full_name?.trim() || params.email.split('@')[0];
    let attendee = await guestRepository.findAttendeeByEmail(params.email);

    if (!attendee) {
      attendee = await guestRepository.createAttendee({
        full_name: fullName,
        email: params.email,
        phone: params.phone,
      });
      logger.info('Guest registered', { attendeeId: attendee.attendee_id, email: attendee.email });
    }

    // Generate and send OTP for verification
    const otpResult = await this.sendOtp(attendee.attendee_id);

    return {
      attendee_id: attendee.attendee_id,
      full_name: attendee.full_name,
      email: attendee.email,
      email_verified: attendee.email_verified,
      otp: otpResult.otp,
    };
  }

  /**
   * Send OTP to guest's email
   */
  async sendOtp(attendeeId?: number, email?: string) {
    let attendee = null;
    if (attendeeId) {
      attendee = await guestRepository.findAttendeeById(attendeeId);
    } else if (email) {
      attendee = await guestRepository.findAttendeeByEmail(email);
    }

    if (!attendee) {
      throw new AppError(404, 'ATTENDEE_NOT_FOUND', 'Guest attendee not found');
    }

    // Generate random 6-digit OTP
    const otp = generateOtp();
    const otpHash = await hashOtp(otp);
    const expiresAt = new Date(Date.now() + parseDuration(env.GUEST_OTP_EXPIRES_IN));

    // Store verification record
    await guestRepository.createEmailVerification({
      attendee_id: attendee.attendee_id,
      otp_hash: otpHash,
      expires_at: expiresAt,
    });

    // Send OTP email (non-blocking / error resilient)
    try {
      await sendOtpEmail(attendee.email, otp, attendee.full_name);
    } catch (err) {
      logger.warn('Failed to send OTP email, proceeding with returned OTP code', { err });
    }

    logger.info('OTP generated for guest', { attendeeId: attendee.attendee_id, otp });
    return {
      attendee_id: attendee.attendee_id,
      otp,
    };
  }

  /**
   * Verify OTP and create guest session
   */
  async verifyOtp(attendeeId: number, otp: string) {
    const attendee = await guestRepository.findAttendeeById(attendeeId);
    if (!attendee) {
      throw new AppError(404, 'ATTENDEE_NOT_FOUND', 'Guest attendee not found');
    }

    // Find latest verification
    const verification = await guestRepository.findLatestVerification(attendeeId);
    if (!verification) {
      throw new AppError(400, 'NO_OTP', 'No active OTP found. Please request a new one.');
    }

    // Check attempt limit
    if (verification.attempt_count >= env.GUEST_OTP_MAX_ATTEMPTS) {
      throw new AppError(429, 'OTP_MAX_ATTEMPTS', 'Maximum verification attempts exceeded. Request a new OTP.');
    }

    // Increment attempt count
    await guestRepository.incrementAttemptCount(verification.verification_id);

    // Verify OTP
    const isValid = await verifyOtp(otp, verification.otp_hash);
    if (!isValid) {
      throw new AppError(400, 'INVALID_OTP', 'Invalid verification code');
    }

    // Consume the verification
    await guestRepository.consumeVerification(verification.verification_id);

    // Mark email as verified
    await guestRepository.markEmailVerified(attendeeId);

    // Create session
    const sessionToken = generateSecureToken(32);
    const sessionExpiresAt = new Date(Date.now() + parseDuration(env.GUEST_SESSION_EXPIRES_IN));

    const session = await guestRepository.createSession({
      attendee_id: attendeeId,
      session_token: sessionToken,
      expires_at: sessionExpiresAt,
    });

    logger.info('Guest verified and session created', { attendeeId, sessionId: session.session_id });

    return {
      attendee_id: attendeeId,
      email_verified: true,
      session_token: sessionToken,
    };
  }

  /**
   * Authenticate a guest by session token
   */
  async authenticateSession(sessionToken: string) {
    const session = await guestRepository.findSessionByToken(sessionToken);
    if (!session) {
      return null;
    }

    // Update last used
    await guestRepository.updateSessionLastUsed(session.session_id);

    const attendee = await guestRepository.findAttendeeById(session.attendee_id);
    if (!attendee) {
      return null;
    }

    return {
      attendeeId: attendee.attendee_id,
      email: attendee.email,
      sessionId: session.session_id,
    };
  }
}

export const guestService = new GuestService();
