import { Router } from 'express';
import { guestController } from '../controllers/guest.controller.js';
import { validate } from '../middleware/validate.js';
import { otpRateLimit } from '../middleware/rateLimit.js';
import { z } from 'zod';

const router = Router();

const registerGuestSchema = z.object({
  body: z.object({
    full_name: z.string().max(150).optional(),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
});

const sendOtpSchema = z.object({
  body: z.object({
    attendee_id: z.number().int().positive().optional(),
    email: z.string().email().optional(),
  }),
});

const verifyOtpSchema = z.object({
  body: z.object({
    attendee_id: z.number().int().positive(),
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
});

// Register a guest attendee
router.post(
  '/register',
  validate(registerGuestSchema),
  (req, res, next) => guestController.register(req, res).catch(next)
);

// Send OTP verification code
router.post(
  '/send-otp',
  otpRateLimit,
  validate(sendOtpSchema),
  (req, res, next) => guestController.sendOtp(req, res).catch(next)
);

// Verify OTP code
router.post(
  '/verify-otp',
  otpRateLimit,
  validate(verifyOtpSchema),
  (req, res, next) => guestController.verifyOtp(req, res).catch(next)
);

export default router;
