import { Router } from 'express';
import { cartController } from '../controllers/cart.controller.js';
import { validate } from '../middleware/validate.js';
import { addCartItemSchema, removeCartItemSchema, updateCartItemSchema } from '../schemas/cart.schema.js';
const router = Router();
router.get('/', (req, res, next) => cartController.getCart(req, res).catch(next));
router.post('/', validate(addCartItemSchema), (req, res, next) => cartController.addItem(req, res).catch(next));
router.patch('/:cartItemId', validate(updateCartItemSchema), (req, res, next) => cartController.updateItem(req, res).catch(next));
router.delete('/:cartItemId', validate(removeCartItemSchema), (req, res, next) => cartController.removeItem(req, res).catch(next));
export default router;
//# sourceMappingURL=cart.routes.js.map