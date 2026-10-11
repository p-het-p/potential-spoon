import { query } from '../config/database.js';

export interface Product {
  product_id: number;
  name: string;
  description: string | null;
  product_type: string;
  member_price: number;
  non_member_price: number | null;
  stock_quantity: number | null;
  is_active: boolean;
  created_at: Date;
  event_id: number | null;
}

export class ProductRepository {
  async findAll(filters: { type?: string; event_id?: number }): Promise<Product[]> {
    let whereClause = 'WHERE is_active = true';
    const params: (string | number)[] = [];
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

    return await query<Product>(productsQuery, params);
  }

  async findById(id: number): Promise<Product | null> {
    const result = await query<Product>(
      'SELECT * FROM products WHERE product_id = $1',
      [id]
    );
    return result[0] || null;
  }

  async getAvailableStock(productId: number): Promise<number | null> {
    const result = await query<{ stock_quantity: number | null }>(
      'SELECT stock_quantity FROM products WHERE product_id = $1',
      [productId]
    );
    return result[0]?.stock_quantity ?? null;
  }
}

export const productRepository = new ProductRepository();
