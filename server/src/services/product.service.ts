import { productRepository } from '../repositories/product.repository.js';
import { AppError } from '../middleware/errorHandler.js';

function formatProduct(product: any) {
  const isTicket = product.product_type === 'event_ticket' || product.product_type === 'ticket' || !!product.event_id;
  const normalPrice = product.non_member_price !== null && product.non_member_price !== undefined
    ? parseFloat(String(product.non_member_price))
    : parseFloat(String(product.member_price));
  const memberPrice = isTicket
    ? Math.round(normalPrice * 0.70 * 100) / 100
    : parseFloat(String(product.member_price));

  return {
    product_id: product.product_id,
    name: product.name,
    description: product.description,
    product_type: product.product_type,
    member_price: memberPrice,
    non_member_price: normalPrice,
    stock_quantity: product.stock_quantity,
    is_active: product.is_active,
    event_id: product.event_id,
  };
}

export class ProductService {
  async getProducts(filters: { type?: string; event_id?: number }) {
    const products = await productRepository.findAll(filters);

    return {
      products: products.map(formatProduct),
    };
  }

  async getProductById(id: number) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
    }

    if (!product.is_active) {
      throw new AppError(404, 'PRODUCT_NOT_AVAILABLE', 'Product is not available');
    }

    return formatProduct(product);
  }

  async checkAvailability(productId: number, quantity: number): Promise<boolean> {
    const stock = await productRepository.getAvailableStock(productId);

    // If stock_quantity is null, it means unlimited stock
    if (stock === null) {
      return true;
    }

    return stock >= quantity;
  }
}

export const productService = new ProductService();
