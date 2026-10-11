import { query } from '../config/database.js';

export interface Cart {
  cart_id: number;
  user_id: string | null;
  attendee_id: number | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface CartItem {
  cart_item_id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  added_at: Date;
}

export interface CartItemWithProduct extends CartItem {
  name: string;
  product_type: string;
}

export class CartRepository {
  async findActiveCartByUserId(userId: string): Promise<Cart | null> {
    const result = await query<Cart>(
      `SELECT * FROM carts WHERE user_id = $1 AND status = 'active' LIMIT 1`,
      [userId]
    );
    return result[0] || null;
  }

  async findActiveCartByAttendeeId(attendeeId: number): Promise<Cart | null> {
    const result = await query<Cart>(
      `SELECT * FROM carts WHERE attendee_id = $1 AND status = 'active' LIMIT 1`,
      [attendeeId]
    );
    return result[0] || null;
  }

  async createCart(params: { user_id?: string; attendee_id?: number }): Promise<Cart> {
    const result = await query<Cart>(
      `INSERT INTO carts (user_id, attendee_id, status)
       VALUES ($1, $2, 'active')
       RETURNING *`,
      [params.user_id || null, params.attendee_id || null]
    );
    return result[0];
  }

  async getCartItems(cartId: number): Promise<CartItemWithProduct[]> {
    return await query<CartItemWithProduct>(
      `SELECT ci.*, p.name, p.product_type
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.product_id
       WHERE ci.cart_id = $1
       ORDER BY ci.added_at ASC`,
      [cartId]
    );
  }

  async findCartItem(cartId: number, productId: number): Promise<CartItem | null> {
    const result = await query<CartItem>(
      `SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
      [cartId, productId]
    );
    return result[0] || null;
  }

  async findCartItemById(cartItemId: number): Promise<CartItem | null> {
    const result = await query<CartItem>(
      `SELECT * FROM cart_items WHERE cart_item_id = $1`,
      [cartItemId]
    );
    return result[0] || null;
  }

  async addCartItem(params: {
    cart_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
  }): Promise<CartItem> {
    const result = await query<CartItem>(
      `INSERT INTO cart_items (cart_id, product_id, quantity, unit_price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [params.cart_id, params.product_id, params.quantity, params.unit_price]
    );
    return result[0];
  }

  async updateCartItemQuantity(cartItemId: number, quantity: number): Promise<CartItem> {
    const result = await query<CartItem>(
      `UPDATE cart_items SET quantity = $2 WHERE cart_item_id = $1 RETURNING *`,
      [cartItemId, quantity]
    );
    return result[0];
  }

  async removeCartItem(cartItemId: number): Promise<void> {
    await query('DELETE FROM cart_items WHERE cart_item_id = $1', [cartItemId]);
  }

  async updateCartStatus(cartId: number, status: string): Promise<Cart> {
    const result = await query<Cart>(
      `UPDATE carts SET status = $2, updated_at = NOW() WHERE cart_id = $1 RETURNING *`,
      [cartId, status]
    );
    return result[0];
  }

  async clearCart(cartId: number): Promise<void> {
    await query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
  }

  async getCartWithOwnerInfo(cartId: number): Promise<Cart | null> {
    const result = await query<Cart>(
      `SELECT * FROM carts WHERE cart_id = $1`,
      [cartId]
    );
    return result[0] || null;
  }
}

export const cartRepository = new CartRepository();
