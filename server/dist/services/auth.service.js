import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';
export class AuthService {
    async register(input) {
        // Check if user already exists
        const existingUser = await userRepository.findByEmail(input.email);
        if (existingUser) {
            throw new AppError(409, 'EMAIL_EXISTS', 'A user with this email already exists');
        }
        // Hash password
        const passwordHash = await hashPassword(input.password);
        // Create user
        const user = await userRepository.create({
            email: input.email,
            password_hash: passwordHash,
            full_name: input.full_name,
            phone: input.phone,
            role: 'member',
        });
        logger.info('User registered', { userId: user.user_id, email: user.email });
        // Generate token
        const token = this.generateToken(user);
        return {
            token,
            user: {
                user_id: user.user_id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
            },
        };
    }
    async login(input) {
        // Find user by email
        const user = await userRepository.findByEmail(input.email);
        if (!user) {
            throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
        }
        // Verify password
        const isValid = await verifyPassword(input.password, user.password_hash);
        if (!isValid) {
            throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
        }
        logger.info('User logged in', { userId: user.user_id, email: user.email });
        // Generate token
        const token = this.generateToken(user);
        return {
            token,
            user: {
                user_id: user.user_id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
            },
        };
    }
    generateToken(user) {
        const payload = {
            userId: user.user_id,
            email: user.email,
            role: user.role,
        };
        return jwt.sign(payload, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN,
        });
    }
    verifyToken(token) {
        try {
            return jwt.verify(token, env.JWT_SECRET);
        }
        catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new AppError(401, 'TOKEN_EXPIRED', 'Token has expired');
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new AppError(401, 'INVALID_TOKEN', 'Invalid token');
            }
            throw error;
        }
    }
}
export const authService = new AuthService();
//# sourceMappingURL=auth.service.js.map