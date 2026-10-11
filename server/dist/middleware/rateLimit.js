import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
// General API rate limiter
export const generalRateLimit = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Authentication rate limiter (stricter)
export const authRateLimit = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.AUTH_RATE_LIMIT_MAX_REQUESTS,
    message: {
        success: false,
        error: {
            code: 'AUTH_RATE_LIMIT_EXCEEDED',
            message: 'Too many authentication attempts, please try again later',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// OTP rate limiter (very strict)
export const otpRateLimit = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.OTP_RATE_LIMIT_MAX_REQUESTS,
    message: {
        success: false,
        error: {
            code: 'OTP_RATE_LIMIT_EXCEEDED',
            message: 'Too many OTP requests, please try again later',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});
//# sourceMappingURL=rateLimit.js.map