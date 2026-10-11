import { productRepository } from '../repositories/product.repository.js';
import { AppError } from '../middleware/errorHandler.js';
export class ProductService {
    async getProducts(filters) {
        const products = await productRepository.findAll(filters);
        return {
            products: products.map((product) => ({
                product_id: product.product_id,
                name: product.name,
                description: product.description,
                product_type: product.product_type,
                member_price: product.member_price,
                non_member_price: product.non_member_price,
                stock_quantity: product.stock_quantity,
                is_active: product.is_active,
                event_id: product.event_id,
            })),
        };
    }
    async getProductById(id) {
        const product = await productRepository.findById(id);
        if (!product) {
            throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
        }
        if (!product.is_active) {
            throw new AppError(404, 'PRODUCT_NOT_AVAILABLE', 'Product is not available');
        }
        return {
            product_id: product.product_id,
            name: product.name,
            description: product.description,
            product_type: product.product_type,
            member_price: product.member_price,
            non_member_price: product.non_member_price,
            stock_quantity: product.stock_quantity,
            is_active: product.is_active,
            event_id: product.event_id,
        };
    }
    async checkAvailability(productId, quantity) {
        const stock = await productRepository.getAvailableStock(productId);
        // If stock_quantity is null, it means unlimited stock
        if (stock === null) {
            return true;
        }
        return stock >= quantity;
    }
}
export const productService = new ProductService();
//# sourceMappingURL=product.service.js.map