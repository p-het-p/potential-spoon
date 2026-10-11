import { Router } from 'express';
import { membershipController } from '../controllers/membership.controller.js';
import { validate } from '../middleware/validate.js';
import { createMembershipSchema } from '../schemas/membership.schema.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// Public: List membership plans
router.get(
  '/plans',
  (req, res, next) => membershipController.getMembershipPlans(req, res).catch(next)
);

// Authenticated: Get user's membership
router.get(
  '/',
  authenticate,
  (req, res, next) => membershipController.getUserMembership(req, res).catch(next)
);

// Authenticated: Create membership
router.post(
  '/',
  authenticate,
  validate(createMembershipSchema),
  (req, res, next) => membershipController.createMembership(req, res).catch(next)
);

export default router;
