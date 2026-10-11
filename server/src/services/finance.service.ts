import { paymentRepository } from '../repositories/payment.repository.js';
import { pool } from '../config/database.js';
import logger from '../utils/logger.js';

export class FinanceService {
  /**
   * Get financial summary
   */
  async getSummary(filters: { start_date?: string; end_date?: string }) {
    const summary = await paymentRepository.getFinancialSummary(
      filters.start_date,
      filters.end_date
    );

    logger.info('Financial summary generated', {
      totalRevenue: summary.total_revenue,
      netBalance: summary.net_balance,
    });

    return summary;
  }

  /**
   * List financial transactions
   */
  async getTransactions(filters: {
    page: number;
    limit: number;
    purpose?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }) {
    const { transactions, total } = await paymentRepository.findTransactions(filters);

    return {
      transactions: transactions.map((t) => ({
        id: t.id,
        purpose: t.purpose,
        amount: parseFloat(String(t.amount)),
        status: t.status,
        created_at: t.created_at,
        paid_at: t.paid_at,
        order_id: t.order_id,
      })),
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
      },
    };
  }

  /**
   * Get volunteer reimbursements / expenses
   */
  async getReimbursements() {
    const result = await pool.query(`
      SELECT 
        e.*,
        t.title as task_title,
        u.full_name as volunteer_name,
        u.email as volunteer_email
      FROM task_expenses e
      JOIN volunteer_tasks t ON e.task_id = t.task_id
      JOIN users u ON e.user_id = u.user_id
      ORDER BY e.created_at DESC;
    `);
    return result.rows;
  }

  /**
   * Update reimbursement status (approve, pay, reject)
   */
  async updateReimbursement(id: string, status: string, note?: string) {
    const result = await pool.query(`
      UPDATE task_expenses
      SET 
        status = $1,
        description = CASE 
          WHEN $2 IS NOT NULL AND $2 != '' THEN description || ' [Treasurer: ' || $2 || ']' 
          ELSE description 
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE expense_id = $3
      RETURNING *;
    `, [status, note || null, id]);
    return result.rows[0];
  }

  /**
   * Get leader activity data (ticket sales, merchandise, fundraisers)
   */
  async getActivityData() {
    const [eventsRes, merchRes, fundraisersRes] = await Promise.all([
      pool.query(`
        SELECT 
          e.id, e.title, e.starts_at, e.capacity,
          COUNT(t.ticket_id)::int as tickets_sold,
          COUNT(t.ticket_id) FILTER (WHERE t.status = 'checked_in')::int as checked_in_count,
          COALESCE(SUM(oi.total_price), 0)::float as revenue
        FROM events e
        LEFT JOIN products p ON p.event_id = e.id
        LEFT JOIN order_items oi ON oi.product_id = p.product_id
        LEFT JOIN event_tickets t ON t.event_id = e.id
        GROUP BY e.id, e.title, e.starts_at, e.capacity
        ORDER BY e.starts_at DESC;
      `),
      pool.query(`
        SELECT 
          p.product_id, p.name, p.product_type, p.stock_quantity,
          COALESCE(SUM(oi.quantity), 0)::int as units_sold,
          COALESCE(SUM(oi.total_price), 0)::float as total_revenue
        FROM products p
        LEFT JOIN order_items oi ON p.product_id = oi.product_id
        WHERE p.product_type = 'merchandise'
        GROUP BY p.product_id, p.name, p.product_type, p.stock_quantity;
      `),
      pool.query(`
        SELECT fundraiser_id, title, goal_amount, current_amount, status, created_at
        FROM fundraisers
        ORDER BY created_at DESC;
      `)
    ]);

    return {
      events: eventsRes.rows,
      merchandise: merchRes.rows,
      fundraisers: fundraisersRes.rows
    };
  }
}

export const financeService = new FinanceService();

