import { Router } from 'express';
import { profileController } from '../controllers/profile.controller.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../schemas/profile.schema.js';

const router = Router();

// Get current user's profile
router.get('/', (req, res, next) => profileController.getProfile(req, res).catch(next));

// Update current user's profile
router.patch(
  '/',
  validate(updateProfileSchema),
  (req, res, next) => profileController.updateProfile(req, res).catch(next)
);

export default router;
