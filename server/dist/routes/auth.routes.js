import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { authRateLimit } from '../middleware/rateLimit.js';
import { authenticate } from '../middleware/authenticate.js';
const router = Router();
// Register - requires stricter rate limiting
router.post('/register', authRateLimit, validate(registerSchema), (req, res, next) => authController.register(req, res).catch(next));
// Login - requires stricter rate limiting
router.post('/login', authRateLimit, validate(loginSchema), (req, res, next) => authController.login(req, res).catch(next));
// Logout - requires authentication
router.post('/logout', authenticate, (req, res, next) => authController.logout(req, res).catch(next));
export default router;
//# sourceMappingURL=auth.routes.js.map