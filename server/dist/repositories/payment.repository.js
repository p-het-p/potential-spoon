import { query } from '../config/database.js';
export class PaymentRepository {
    async create(params) {
        const result = await query(`INSERT INTO payments (order_id, user_id, membership_id, amount, currency, purpose, status, razorpay_order_id)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)
       RETURNING *`, [
            params.order_id || null,
            params.user_id || null,
            params.membership_id || null,
            params.amount,
            params.currency || 'INR',
            params.purpose,
            params.razorpay_order_id || null,
        ]);
        return result[0];
    }
    async findById(id) {
        const result = await query('SELECT * FROM payments WHERE id = $1', [id]);
        return result[0] || null;
    }
    async findByOrderId(orderId) {
        const result = await query('SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1', [orderId]);
        return result[0] || null;
    }
    async findByRazorpayOrderId(razorpayOrderId) {
        const result = await query('SELECT * FROM payments WHERE razorpay_order_id = $1', [razorpayOrderId]);
        return result[0] || null;
    }
    async updatePaymentStatus(id, status, razorpayPaymentId, razorpaySignature) {
        const paidAt = status === 'successful' ? new Date() : null;
        const result = await query(`UPDATE payments
       SET status = $2, razorpay_payment_id = COALESCE($3, razorpay_payment_id),
           razorpay_signature = COALESCE($4, razorpay_signature), paid_at = COALESCE($5, paid_at)
       WHERE id = $1 RETURNING *`, [id, status, razorpayPaymentId || null, razorpaySignature || null, paidAt]);
        return result[0];
    }
    async findTransactions(filters) {
        const offset = (filters.page - 1) * filters.limit;
        let whereClause = '';
        const conditions = [];
        const params = [];
        let paramIndex = 1;
        if (filters.purpose) {
            conditions.push(`purpose = $${paramIndex++}`);
            params.push(filters.purpose);
        }
        if (filters.status) {
            conditions.push(`status = $${paramIndex++}`);
            params.push(filters.status);
        }
        if (filters.start_date) {
            conditions.push(`created_at >= $${paramIndex++}`);
            params.push(filters.start_date);
        }
        if (filters.end_date) {
            conditions.push(`created_at <= $${paramIndex++}`);
            params.push(filters.end_date);
        }
        if (conditions.length > 0) {
            whereClause = `WHERE ${conditions.join(' AND ')}`;
        }
        const countResult = await query(`SELECT COUNT(*) as count FROM payments ${whereClause}`, params);
        const total = parseInt(countResult[0].count, 10);
        params.push(filters.limit, offset);
        const transactions = await query(`SELECT * FROM payments ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`, params);
        return { transactions, total };
    }
    async getFinancialSummary(startDate, endDate) {
        let whereClause = '';
        const params = [];
        let paramIndex = 1;
        if (startDate) {
            whereClause += ` AND created_at >= $${paramIndex++}`;
            params.push(startDate);
        }
        if (endDate) {
            whereClause += ` AND created_at <= $${paramIndex++}`;
            params.push(endDate);
        }
        const result = await query(`SELECT
         COALESCE(SUM(CASE WHEN status = 'successful' THEN amount ELSE 0 END), 0) as total_revenue,
         COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_payments,
         COALESCE(SUM(CASE WHEN status = 'failed' THEN amount ELSE 0 END), 0) as failed_payments,
         COALESCE(SUM(CASE WHEN status = 'refunded' THEN amount ELSE 0 END), 0) as refunded
       FROM payments WHERE 1=1 ${whereClause}`, params);
        const summary = result[0];
        const totalRevenue = parseFloat(summary.total_revenue);
        const refunded = parseFloat(summary.refunded);
        return {
            total_revenue: totalRevenue,
            pending_payments: parseFloat(summary.pending_payments),
            failed_payments: parseFloat(summary.failed_payments),
            refunded,
            net_balance: totalRevenue - refunded,
        };
    }
}
export const paymentRepository = new PaymentRepository();
//# sourceMappingURL=payment.repository.js.map