import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';
import { validate } from '../middleware/validate.js';
import { getProductsSchema } from '../schemas/product.schema.js';
import { authenticate } from '../middleware/authenticate.js';
import { clubLeaderOnly } from '../middleware/authorize.js';

const router = Router();

// Public: List available products
router.get(
  '/',
  validate(getProductsSchema),
  (req, res, next) => productController.getProducts(req, res).catch(next)
);

// Public: Get product details
router.get(
  '/:id',
  (req, res, next) => productController.getProductById(req, res).catch(next)
);

// Club Leader only: Create merchandise product
router.post(
  '/',
  authenticate,
  clubLeaderOnly,
  (req, res, next) => productController.createProduct(req, res).catch(next)
);

// Club Leader only: Update merchandise product
router.patch(
  '/:id',
  authenticate,
  clubLeaderOnly,
  (req, res, next) => productController.updateProduct(req, res).catch(next)
);

// Club Leader only: Delete merchandise product
router.delete(
  '/:id',
  authenticate,
  clubLeaderOnly,
  (req, res, next) => productController.deleteProduct(req, res).catch(next)
);

export default router;

