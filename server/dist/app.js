import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalRateLimit } from './middleware/rateLimit.js';
import { authenticate } from './middleware/authenticate.js';
import { treasurerOnly } from './middleware/authorize.js';
import { guestService } from './services/guest.service.js';
import logger from './utils/logger.js';
// Import routes
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import eventsRoutes from './routes/events.routes.js';
import productsRoutes from './routes/products.routes.js';
import membershipsRoutes from './routes/memberships.routes.js';
import cartRoutes from './routes/cart.routes.js';
import guestRoutes from './routes/guest.routes.js';
import checkoutRoutes from './routes/checkout.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import paymentsRoutes from './routes/payments.routes.js';
import ticketsRoutes from './routes/tickets.routes.js';
import financeRoutes from './routes/finance.routes.js';
import leaderRoutes from './routes/leader.routes.js';
// Import ticket controller for nested route
import { ticketController } from './controllers/tickets.controller.js';
/**
 * Middleware that authenticates either a JWT user or a guest session cookie.
 * At least one must be present.
 */
function authenticateUserOrGuest(req, res, next) {
    const authHeader = req.headers.authorization;
    // Try JWT first
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authenticate(req, res, next);
    }
    // Try guest session cookie or header
    const guestSessionToken = req.cookies?.guest_session || req.headers['x-guest-session'];
    if (guestSessionToken) {
        guestService
            .authenticateSession(guestSessionToken)
            .then((guest) => {
            if (!guest) {
                res.status(401).json({
                    success: false,
                    error: { code: 'INVALID_SESSION', message: 'Invalid or expired guest session' },
                });
                return;
            }
            req.guest = {
                attendeeId: guest.attendeeId,
                email: guest.email,
                sessionId: guest.sessionId,
            };
            next();
        })
            .catch(next);
        return;
    }
    res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    });
}
export async function createApp() {
    const app = express();
    // Security middleware
    app.use(helmet());
    // CORS configuration
    app.use(cors({
        origin: [env.APP_ORIGIN, env.FRONTEND_URL],
        credentials: true,
    }));
    // Body parsing middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    // Rate limiting
    app.use(generalRateLimit);
    // Request logging
    app.use((req, _res, next) => {
        logger.info(`${req.method} ${req.path}`, {
            ip: req.ip,
            userAgent: req.get('user-agent'),
        });
        next();
    });
    // ─── API routes ─────────────────────────────────────────────────────
    // Public routes (no auth)
    app.use(`${env.API_BASE_PATH}/health`, healthRoutes);
    app.use(`${env.API_BASE_PATH}/auth`, authRoutes);
    app.use(`${env.API_BASE_PATH}/events`, eventsRoutes);
    app.use(`${env.API_BASE_PATH}/products`, productsRoutes);
    app.use(`${env.API_BASE_PATH}/guest`, guestRoutes);
    // Membership plans listing is public, other membership routes need auth
    app.use(`${env.API_BASE_PATH}/memberships`, membershipsRoutes);
    // Authenticated-only routes
    app.use(`${env.API_BASE_PATH}/me`, authenticate, profileRoutes);
    // Authenticated or guest routes
    app.use(`${env.API_BASE_PATH}/orders`, authenticateUserOrGuest, ordersRoutes);
    // Routes that accept either JWT user or guest session
    app.use(`${env.API_BASE_PATH}/cart`, authenticateUserOrGuest, cartRoutes);
    app.use(`${env.API_BASE_PATH}/checkout`, authenticateUserOrGuest, checkoutRoutes);
    // Payment routes - /verify needs auth, /razorpay/webhook is open (signature-checked internally)
    app.use(`${env.API_BASE_PATH}/payments`, paymentsRoutes);
    // Ticket routes
    app.use(`${env.API_BASE_PATH}/tickets`, ticketsRoutes);
    // Nested: GET /orders/:orderId/tickets
    app.get(`${env.API_BASE_PATH}/orders/:orderId/tickets`, authenticateUserOrGuest, (req, res, next) => ticketController.getOrderTickets(req, res).catch(next));
    // Finance routes (treasurer only)
    app.use(`${env.API_BASE_PATH}/finance`, authenticate, treasurerOnly, financeRoutes);
    // Leader routes
    app.use(`${env.API_BASE_PATH}/leader`, leaderRoutes);
    // ─── 404 handler ────────────────────────────────────────────────────
    app.use((_req, res) => {
        res.status(404).json({
            success: false,
            error: {
                code: 'NOT_FOUND',
                message: 'The requested resource was not found',
            },
        });
    });
    // Error handling middleware (must be last)
    app.use(errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map