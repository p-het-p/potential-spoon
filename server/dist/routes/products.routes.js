import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';
import { validate } from '../middleware/validate.js';
import { getProductsSchema } from '../schemas/product.schema.js';
const router = Router();
// Public: List available products
router.get('/', validate(getProductsSchema), (req, res, next) => productController.getProducts(req, res).catch(next));
// Public: Get product details
router.get('/:id', (req, res, next) => productController.getProductById(req, res).catch(next));
export default router;
//# sourceMappingURL=products.routes.js.map