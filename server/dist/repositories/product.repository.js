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
    async create(data) {
        const result = await query(`INSERT INTO products (name, description, product_type, member_price, non_member_price, stock_quantity, is_active, event_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`, [
            data.name,
            data.description || null,
            data.product_type || 'merchandise',
            data.member_price,
            data.non_member_price ?? data.member_price,
            data.stock_quantity ?? 100,
            data.is_active !== undefined ? data.is_active : true,
            data.event_id || null,
        ]);
        return result[0];
    }
    async update(id, data) {
        const fields = [];
        const values = [];
        let index = 1;
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                fields.push(`${key} = $${index++}`);
                values.push(value);
            }
        }
        if (fields.length === 0)
            return this.findById(id);
        values.push(id);
        const result = await query(`UPDATE products SET ${fields.join(', ')} WHERE product_id = $${index} RETURNING *`, values);
        return result[0] || null;
    }
    async delete(id) {
        const result = await query(`DELETE FROM products WHERE product_id = $1 RETURNING *`, [id]);
        return result.length > 0;
    }
}
export const productRepository = new ProductRepository();
//# sourceMappingURL=product.repository.js.map