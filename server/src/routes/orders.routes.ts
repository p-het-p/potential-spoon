import { Router } from 'express';
import { orderController } from '../controllers/orders.controller.js';
import { validate } from '../middleware/validate.js';
import { getOrdersSchema, getOrderSchema } from '../schemas/order.schema.js';

const router = Router();

// List user's orders
router.get(
  '/',
  validate(getOrdersSchema),
  (req, res, next) => orderController.getOrders(req, res).catch(next)
);

// Get order details
router.get(
  '/:orderId',
  validate(getOrderSchema),
  (req, res, next) => orderController.getOrderById(req, res).catch(next)
);

export default router;
