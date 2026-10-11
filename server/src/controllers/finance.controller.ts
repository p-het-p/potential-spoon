import { Request, Response } from 'express';
import { financeService } from '../services/finance.service.js';

export class FinanceController {
  async getSummary(req: Request, res: Response): Promise<void> {
    const { start_date, end_date } = req.query;

    const summary = await financeService.getSummary({
      start_date: start_date as string,
      end_date: end_date as string,
    });

    res.status(200).json({
      success: true,
      data: summary,
    });
  }

  async getTransactions(req: Request, res: Response): Promise<void> {
    const { page, limit, purpose, status, start_date, end_date } = req.query;

    const result = await financeService.getTransactions({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      purpose: purpose as string,
      status: status as string,
      start_date: start_date as string,
      end_date: end_date as string,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async getReimbursements(_req: Request, res: Response): Promise<void> {
    const reimbursements = await financeService.getReimbursements();
    res.status(200).json({
      success: true,
      data: reimbursements,
    });
  }

  async updateReimbursement(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { status, note } = req.body;
    const updated = await financeService.updateReimbursement(id, status, note);
    res.status(200).json({
      success: true,
      data: updated,
    });
  }

  async getActivityData(_req: Request, res: Response): Promise<void> {
    const data = await financeService.getActivityData();
    res.status(200).json({
      success: true,
      data,
    });
  }
}

export const financeController = new FinanceController();
