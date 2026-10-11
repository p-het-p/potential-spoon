import { financeService } from '../services/finance.service.js';
export class FinanceController {
    async getSummary(req, res) {
        const { start_date, end_date } = req.query;
        const summary = await financeService.getSummary({
            start_date: start_date,
            end_date: end_date,
        });
        res.status(200).json({
            success: true,
            data: summary,
        });
    }
    async getTransactions(req, res) {
        const { page, limit, purpose, status, start_date, end_date } = req.query;
        const result = await financeService.getTransactions({
            page: Number(page) || 1,
            limit: Number(limit) || 20,
            purpose: purpose,
            status: status,
            start_date: start_date,
            end_date: end_date,
        });
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    async getReimbursements(_req, res) {
        const reimbursements = await financeService.getReimbursements();
        res.status(200).json({
            success: true,
            data: reimbursements,
        });
    }
    async updateReimbursement(req, res) {
        const { id } = req.params;
        const { status, note } = req.body;
        const updated = await financeService.updateReimbursement(id, status, note);
        res.status(200).json({
            success: true,
            data: updated,
        });
    }
    async getActivityData(_req, res) {
        const data = await financeService.getActivityData();
        res.status(200).json({
            success: true,
            data,
        });
    }
}
export const financeController = new FinanceController();
//# sourceMappingURL=finance.controller.js.map