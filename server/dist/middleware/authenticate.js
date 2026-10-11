import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';
export function authenticate(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError(401, 'UNAUTHORIZED', 'Authentication token is required'));
    }
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };
        logger.debug('User authenticated', { userId: decoded.userId });
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new AppError(401, 'TOKEN_EXPIRED', 'Authentication token has expired'));
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError(401, 'INVALID_TOKEN', 'Invalid authentication token'));
        }
        next(error);
    }
}
// Optional authentication - doesn't throw error if no token
export function optionalAuthenticate(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }
    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };
        logger.debug('User optionally authenticated', { userId: decoded.userId });
    }
    catch (error) {
        // Ignore errors for optional authentication
        logger.debug('Optional authentication failed, continuing as guest');
    }
    next();
}
//# sourceMappingURL=authenticate.js.map