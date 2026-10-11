import { cartRepository } from '../repositories/cart.repository.js';
import { transaction } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';
import { randomBytes } from 'crypto';

type PaymentMethod = 'cash' | 'card' | 'upi' | 'bank_transfer';

export class CheckoutService {
  /**
   * Preview checkout totals without creating an order
   */
  async preview(params: { userId?: string; attendeeId?: number }) {
    const cart = params.userId
      ? await cartRepository.findActiveCartByUserId(params.userId)
      : await cartRepository.findActiveCartByAttendeeId(params.attendeeId!);

    if (!cart) {
      throw new AppError(400, 'CART_EMPTY', 'No active cart found');
    }

    const items = await cartRepository.getCartItems(cart.cart_id);
    if (items.length === 0) {
      throw new AppError(400, 'CART_EMPTY', 'Cart is empty');
    }

    const cartItems = items.map((item) => ({
      product_id: item.product_id,
      name: item.name,
      quantity: item.quantity,
      unit_price: parseFloat(String(item.unit_price)),
      total: parseFloat(String(item.unit_price)) * item.quantity,
    }));

    const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);

    return {
      items: cartItems,
      subtotal,
      total: subtotal,
      currency: 'INR',
    };
  }

  /**
   * Complete a direct/manual payment.
   *
   * Razorpay is deliberately disabled for the current release. This records a
   * successful payment in the local database in the same transaction as the
   * order, inventory deduction, and ticket issuance.
   */
  async checkout(params: { userId?: string; attendeeId?: number; paymentMethod: PaymentMethod }) {
    const cart = params.userId
      ? await cartRepository.findActiveCartByUserId(params.userId)
      : await cartRepository.findActiveCartByAttendeeId(params.attendeeId!);

    if (!cart) {
      throw new AppError(400, 'CART_EMPTY', 'No active cart found');
    }

    const items = await cartRepository.getCartItems(cart.cart_id);
    if (items.length === 0) {
      throw new AppError(400, 'CART_EMPTY', 'Cart is empty');
    }

    // Use transaction for atomic inventory check + order creation
    const result = await transaction(async (client: any) => {
      const lockedProducts = new Map<number, { stock_quantity: number | null; product_type: string; event_id: number | null }>();

      // Lock and check inventory for each product.
      for (const item of items) {
        const lockResult = await client.query(
          'SELECT product_id, stock_quantity, product_type, event_id FROM products WHERE product_id = $1 FOR UPDATE',
          [item.product_id]
        );

        const product = lockResult.rows[0];
        if (!product) {
          throw new AppError(400, 'PRODUCT_NOT_FOUND', `Product ${item.name} no longer exists`);
        }
        lockedProducts.set(item.product_id, product);

        // NULL stock_quantity means unlimited
        if (product.stock_quantity !== null && product.stock_quantity < item.quantity) {
          throw new AppError(400, 'INSUFFICIENT_STOCK', `Not enough stock for ${item.name}`);
        }

        // Deduct inventory
        if (product.stock_quantity !== null) {
          await client.query(
            'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE product_id = $2',
            [item.quantity, item.product_id]
          );
        }
      }

      // Calculate total
      const totalAmount = items.reduce(
        (sum, item) => sum + parseFloat(String(item.unit_price)) * item.quantity,
        0
      );

      // Payment is accepted locally rather than handed to Razorpay.
      const orderResult = await client.query(
        `INSERT INTO orders (user_id, attendee_id, total_amount, currency, status, completed_at)
         VALUES ($1, $2, $3, 'INR', 'paid', NOW())
         RETURNING *`,
        [params.userId || null, params.attendeeId || null, totalAmount]
      );
      const order = orderResult.rows[0];

      // Preserve product details at the time of purchase.
      for (const item of items) {
        const unitPrice = parseFloat(String(item.unit_price));
        const itemResult = await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING order_item_id`,
          [order.order_id, item.product_id, item.name, item.quantity, unitPrice, unitPrice * item.quantity]
        );
        const product = lockedProducts.get(item.product_id)!;

        // Event-ticket products receive one active QR ticket per purchased unit.
        if ((product.product_type === 'event_ticket' || product.product_type === 'ticket') && product.event_id) {
          for (let index = 1; index <= item.quantity; index += 1) {
            await client.query(
              `INSERT INTO event_tickets (order_id, order_item_id, event_id, ticket_number, qr_token, status)
               VALUES ($1, $2, $3, $4, $5, 'active')`,
              [
                order.order_id,
                itemResult.rows[0].order_item_id,
                product.event_id,
                `CC-${order.order_id}-${itemResult.rows[0].order_item_id}-${index}`,
                randomBytes(32).toString('hex'),
              ]
            );
          }
        }
      }

      const purpose = items.every((item) => lockedProducts.get(item.product_id)?.product_type === 'merchandise')
        ? 'merchandise'
        : 'ticket';

      // Store a local payment audit record. provider_ref identifies the selected
      // method without pretending a third-party payment gateway was used.
      await client.query(
        `INSERT INTO payments (order_id, user_id, amount, currency, purpose, status, provider_ref, paid_at)
         VALUES ($1, $2, $3, 'INR', $4, 'successful', $5, NOW())`,
        [order.order_id, params.userId || null, totalAmount, purpose, `manual:${params.paymentMethod}:order:${order.order_id}`]
      );

      // Mark cart as checked out
      await client.query(
        `UPDATE carts SET status = 'checked_out', updated_at = NOW() WHERE cart_id = $1`,
        [cart.cart_id]
      );

      return {
        order_id: order.order_id,
        amount: totalAmount,
        currency: 'INR',
        payment_method: params.paymentMethod,
        payment_status: 'successful',
        message: 'Payment successful. Your order has been confirmed.',
      };
    });

    logger.info('Checkout completed', {
      orderId: result.order_id,
      paymentMethod: params.paymentMethod,
      userId: params.userId,
      attendeeId: params.attendeeId,
    });

    return result;
  }
}

export const checkoutService = new CheckoutService();
