import { productService } from '../services/product.service.js';
export class ProductController {
    async getProducts(req, res) {
        const { type, event_id } = req.query;
        const result = await productService.getProducts({
            type: type,
            event_id: event_id ? Number(event_id) : undefined,
        });
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    async getProductById(req, res) {
        const { id } = req.params;
        const product = await productService.getProductById(Number(id));
        res.status(200).json({
            success: true,
            data: product,
        });
    }
}
export const productController = new ProductController();
//# sourceMappingURL=product.controller.js.map