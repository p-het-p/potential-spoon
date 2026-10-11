import { Router } from 'express';
import { checkoutController } from '../controllers/checkout.controller.js';
import { validate } from '../middleware/validate.js';
import { checkoutSchema } from '../schemas/checkout.schema.js';
const router = Router();
// Preview checkout totals
router.post('/preview', (req, res, next) => checkoutController.preview(req, res).catch(next));
// Initiate checkout (create Razorpay order)
router.post('/', validate(checkoutSchema), (req, res, next) => checkoutController.checkout(req, res).catch(next));
export default router;
//# sourceMappingURL=checkout.routes.js.map