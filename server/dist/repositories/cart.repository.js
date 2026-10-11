import { query } from '../config/database.js';
export class CartRepository {
    async findActiveCartByUserId(userId) {
        const result = await query(`SELECT * FROM carts WHERE user_id = $1 AND status = 'active' LIMIT 1`, [userId]);
        return result[0] || null;
    }
    async findActiveCartByAttendeeId(attendeeId) {
        const result = await query(`SELECT * FROM carts WHERE attendee_id = $1 AND status = 'active' LIMIT 1`, [attendeeId]);
        return result[0] || null;
    }
    async createCart(params) {
        const result = await query(`INSERT INTO carts (user_id, attendee_id, status)
       VALUES ($1, $2, 'active')
       RETURNING *`, [params.user_id || null, params.attendee_id || null]);
        return result[0];
    }
    async getCartItems(cartId) {
        return await query(`SELECT ci.*, p.name, p.product_type
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.product_id
       WHERE ci.cart_id = $1
       ORDER BY ci.added_at ASC`, [cartId]);
    }
    async findCartItem(cartId, productId) {
        const result = await query(`SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2`, [cartId, productId]);
        return result[0] || null;
    }
    async findCartItemById(cartItemId) {
        const result = await query(`SELECT * FROM cart_items WHERE cart_item_id = $1`, [cartItemId]);
        return result[0] || null;
    }
    async addCartItem(params) {
        const result = await query(`INSERT INTO cart_items (cart_id, product_id, quantity, unit_price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`, [params.cart_id, params.product_id, params.quantity, params.unit_price]);
        return result[0];
    }
    async updateCartItemQuantity(cartItemId, quantity) {
        const result = await query(`UPDATE cart_items SET quantity = $2 WHERE cart_item_id = $1 RETURNING *`, [cartItemId, quantity]);
        return result[0];
    }
    async removeCartItem(cartItemId) {
        await query('DELETE FROM cart_items WHERE cart_item_id = $1', [cartItemId]);
    }
    async updateCartStatus(cartId, status) {
        const result = await query(`UPDATE carts SET status = $2, updated_at = NOW() WHERE cart_id = $1 RETURNING *`, [cartId, status]);
        return result[0];
    }
    async clearCart(cartId) {
        await query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
    }
    async getCartWithOwnerInfo(cartId) {
        const result = await query(`SELECT * FROM carts WHERE cart_id = $1`, [cartId]);
        return result[0] || null;
    }
}
export const cartRepository = new CartRepository();
//# sourceMappingURL=cart.repository.js.map