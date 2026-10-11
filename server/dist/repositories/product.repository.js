import { query } from '../config/database.js';
export class ProductRepository {
    async findAll(filters) {
        let whereClause = 'WHERE is_active = true';
        const params = [];
        let paramIndex = 1;
        if (filters.type) {
            whereClause += ` AND product_type = $${paramIndex++}`;
            params.push(filters.type);
        }
        if (filters.event_id) {
            whereClause += ` AND event_id = $${paramIndex++}`;
            params.push(filters.event_id);
        }
        const productsQuery = `
      SELECT * FROM products
      ${whereClause}
      ORDER BY created_at DESC
    `;
        return await query(productsQuery, params);
    }
    async findById(id) {
        const result = await query('SELECT * FROM products WHERE product_id = $1', [id]);
        return result[0] || null;
    }
    async getAvailableStock(productId) {
        const result = await query('SELECT stock_quantity FROM products WHERE product_id = $1', [productId]);
        return result[0]?.stock_quantity ?? null;
    }
}
export const productRepository = new ProductRepository();
//# sourceMappingURL=product.repository.js.map