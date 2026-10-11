import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();
const envSchema = z.object({
    // Server
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default('5000'),
    API_BASE_PATH: z.string().default('/api/v1'),
    // Database
    DATABASE_URL: z.string().url(),
    // JWT
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default('1h'),
    REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
    // Razorpay
    RAZORPAY_KEY_ID: z.string(),
    RAZORPAY_KEY_SECRET: z.string(),
    RAZORPAY_WEBHOOK_SECRET: z.string(),
    // Email
    EMAIL_PROVIDER: z.string().default('nodemailer'),
    EMAIL_FROM: z.string().email(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.string().transform(Number),
    SMTP_USER: z.string(),
    SMTP_PASSWORD: z.string(),
    // Guest Sessions
    GUEST_SESSION_SECRET: z.string().min(32),
    GUEST_OTP_SECRET: z.string().min(32),
    GUEST_SESSION_EXPIRES_IN: z.string().default('24h'),
    GUEST_OTP_EXPIRES_IN: z.string().default('10m'),
    GUEST_OTP_MAX_ATTEMPTS: z.string().transform(Number).default('3'),
    GUEST_OTP_RESEND_COOLDOWN: z.string().default('2m'),
    // CORS
    APP_ORIGIN: z.string().url(),
    FRONTEND_URL: z.string().url(),
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('60000'),
    RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
    AUTH_RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('5'),
    OTP_RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('3'),
    // Logging
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    LOG_FILE: z.string().default('logs/app.log'),
    // WebSocket
    SOCKET_CORS_ORIGIN: z.string().url(),
});
function validateEnv() {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            const missingVars = error.errors
                .map((e) => e.path.join('.'))
                .join(', ');
            throw new Error(`Missing or invalid environment variables: ${missingVars}\n` +
                'Please check your .env file against .env.example');
        }
        throw error;
    }
}
export const env = validateEnv();
//# sourceMappingURL=env.js.map