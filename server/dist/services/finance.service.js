import { paymentRepository } from '../repositories/payment.repository.js';
import logger from '../utils/logger.js';
export class FinanceService {
    /**
     * Get financial summary
     */
    async getSummary(filters) {
        const summary = await paymentRepository.getFinancialSummary(filters.start_date, filters.end_date);
        logger.info('Financial summary generated', {
            totalRevenue: summary.total_revenue,
            netBalance: summary.net_balance,
        });
        return summary;
    }
    /**
     * List financial transactions
     */
    async getTransactions(filters) {
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
}
export const financeService = new FinanceService();
//# sourceMappingURL=finance.service.js.map