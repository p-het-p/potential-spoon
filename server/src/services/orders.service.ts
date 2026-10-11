import { orderRepository } from '../repositories/order.repository.js';
import { AppError } from '../middleware/errorHandler.js';

export class OrderService {
  /**
   * List orders for a user or guest attendee
   */
  async getUserOrders(params: { userId?: string; attendeeId?: number }, filters: { page: number; limit: number; status?: string }) {
    const { orders, total } = params.userId
      ? await orderRepository.findByUserId(params.userId, filters)
      : params.attendeeId
      ? await orderRepository.findByAttendeeId(params.attendeeId, filters)
      : { orders: [], total: 0 };

    return {
      orders: orders.map((order) => ({
        order_id: order.order_id,
        total_amount: parseFloat(String(order.total_amount)),
        currency: order.currency,
        status: order.status,
        created_at: order.created_at,
        completed_at: order.completed_at,
      })),
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
      },
    };
  }

  /**
   * List all orders (for club_leader/treasurer)
   */
  async getAllOrders(filters: { page: number; limit: number; status?: string }) {
    const { orders, total } = await orderRepository.findAllOrders(filters);

    return {
      orders: orders.map((order) => ({
        order_id: order.order_id,
        total_amount: parseFloat(String(order.total_amount)),
        currency: order.currency,
        status: order.status,
        created_at: order.created_at,
        completed_at: order.completed_at,
        user_id: order.user_id,
        attendee_id: order.attendee_id,
      })),
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
      },
    };
  }

  /**
   * Get order details with items
   */
  async getOrderById(orderId: number, userId?: string, role?: string, attendeeId?: number) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');
    }

    // Authorization: members see only their own orders, leaders/treasurers see all
    if (userId && role === 'member' && order.user_id !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'You do not have access to this order');
    }

    // Guest attendees see only orders matching their attendee_id
    if (attendeeId && order.attendee_id !== attendeeId) {
      throw new AppError(403, 'FORBIDDEN', 'You do not have access to this order');
    }

    const items = await orderRepository.getOrderItems(orderId);

    return {
      order_id: order.order_id,
      total_amount: parseFloat(String(order.total_amount)),
      currency: order.currency,
      status: order.status,
      created_at: order.created_at,
      completed_at: order.completed_at,
      items: items.map((item) => ({
        order_item_id: item.order_item_id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: parseFloat(String(item.unit_price)),
        total_price: parseFloat(String(item.total_price)),
      })),
    };
  }
}

export const orderService = new OrderService();
