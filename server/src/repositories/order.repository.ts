import { query } from '../config/database.js';

export interface OrderFilters {
  page: number;
  limit: number;
  status?: string;
}

export class OrderRepository {
  async findByUserId(userId: string, filters: OrderFilters) {
    const offset = (filters.page - 1) * filters.limit;
    
    let baseQuery = `
      FROM orders
      WHERE user_id = $1
    `;
    const params: any[] = [userId];

    if (filters.status) {
      params.push(filters.status);
      baseQuery += ` AND status = $2`;
    }

    const countResult = await query(`SELECT COUNT(*) ${baseQuery}`, params);
    const total = parseInt(countResult[0].count, 10);

    const ordersQuery = `
      SELECT order_id, user_id, attendee_id, total_amount, currency, status, created_at, completed_at
      ${baseQuery}
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    const ordersResult = await query(ordersQuery, [...params, filters.limit, offset]);

    return {
      orders: ordersResult,
      total,
    };
  }

  async findByAttendeeId(attendeeId: number, filters: OrderFilters) {
    const offset = (filters.page - 1) * filters.limit;
    
    let baseQuery = `
      FROM orders
      WHERE attendee_id = $1
    `;
    const params: any[] = [attendeeId];

    if (filters.status) {
      params.push(filters.status);
      baseQuery += ` AND status = $2`;
    }

    const countResult = await query(`SELECT COUNT(*) ${baseQuery}`, params);
    const total = parseInt(countResult[0].count, 10);

    const ordersQuery = `
      SELECT order_id, user_id, attendee_id, total_amount, currency, status, created_at, completed_at
      ${baseQuery}
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    const ordersResult = await query(ordersQuery, [...params, filters.limit, offset]);

    return {
      orders: ordersResult,
      total,
    };
  }

  async findAllOrders(filters: OrderFilters) {
    const offset = (filters.page - 1) * filters.limit;
    
    let baseQuery = `FROM orders`;
    const params: any[] = [];

    if (filters.status) {
      params.push(filters.status);
      baseQuery += ` WHERE status = $1`;
    }

    const countResult = await query(`SELECT COUNT(*) ${baseQuery}`, params);
    const total = parseInt(countResult[0].count, 10);

    const ordersQuery = `
      SELECT order_id, user_id, attendee_id, total_amount, currency, status, created_at, completed_at
      ${baseQuery}
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    const ordersResult = await query(ordersQuery, [...params, filters.limit, offset]);

    return {
      orders: ordersResult,
      total,
    };
  }

  async findById(orderId: number) {
    const result = await query(
      `SELECT order_id, user_id, attendee_id, total_amount, currency, status, created_at, completed_at
       FROM orders
       WHERE order_id = $1`,
      [orderId]
    );
    return result[0] || null;
  }

  async getOrderItems(orderId: number) {
    const result = await query(
      `SELECT oi.order_item_id, oi.product_id, p.name as product_name, oi.quantity, oi.unit_price, oi.total_price
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = $1`,
      [orderId]
    );
    return result;
  }
}

export const orderRepository = new OrderRepository();
