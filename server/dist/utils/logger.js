import winston from 'winston';
import { env } from '../config/env.js';
import fs from 'fs';
import path from 'path';
// Ensure logs directory exists
const logsDir = path.dirname(env.LOG_FILE);
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}
// Define log format
const logFormat = winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.errors({ stack: true }), winston.format.splat(), winston.format.json());
// Console format for development
const consoleFormat = winston.format.combine(winston.format.colorize(), winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
}));
// Create logger instance
const logger = winston.createLogger({
    level: env.LOG_LEVEL,
    format: logFormat,
    transports: [
        // Write all logs to file
        new winston.transports.File({
            filename: env.LOG_FILE,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Write error logs to separate file
        new winston.transports.File({
            filename: env.LOG_FILE.replace('.log', '-error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
});
// Add console transport in development
if (env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat,
    }));
}
// Redact sensitive information from logs
const originalInfo = logger.info.bind(logger);
// @ts-ignore
logger.info = function (message, meta) {
    if (meta) {
        meta = redactSensitiveData(meta);
    }
    return originalInfo(message, meta);
};
const originalError = logger.error.bind(logger);
// @ts-ignore
logger.error = function (message, meta) {
    if (meta) {
        meta = redactSensitiveData(meta);
    }
    return originalError(message, meta);
};
const originalWarn = logger.warn.bind(logger);
// @ts-ignore
logger.warn = function (message, meta) {
    if (meta) {
        meta = redactSensitiveData(meta);
    }
    return originalWarn(message, meta);
};
const originalDebug = logger.debug.bind(logger);
// @ts-ignore
logger.debug = function (message, meta) {
    if (meta) {
        meta = redactSensitiveData(meta);
    }
    return originalDebug(message, meta);
};
function redactSensitiveData(data) {
    if (!data)
        return data;
    const sensitiveKeys = [
        'password',
        'password_hash',
        'otp',
        'otp_hash',
        'token',
        'jwt',
        'secret',
        'key',
        'authorization',
        'razorpay_key',
        'razorpay_secret',
        'razorpay_signature',
        'webhook_secret',
        'session_token',
        'qr_token',
    ];
    if (typeof data === 'string') {
        return data;
    }
    if (Array.isArray(data)) {
        return data.map((item) => redactSensitiveData(item));
    }
    if (typeof data === 'object') {
        const redacted = {};
        for (const [key, value] of Object.entries(data)) {
            const lowerKey = key.toLowerCase();
            if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
                redacted[key] = '[REDACTED]';
            }
            else {
                redacted[key] = redactSensitiveData(value);
            }
        }
        return redacted;
    }
    return data;
}
export default logger;
//# sourceMappingURL=logger.js.map