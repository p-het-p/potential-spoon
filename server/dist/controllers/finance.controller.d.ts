import { Request, Response } from 'express';
export declare class FinanceController {
    getSummary(req: Request, res: Response): Promise<void>;
    getTransactions(req: Request, res: Response): Promise<void>;
    getReimbursements(_req: Request, res: Response): Promise<void>;
    updateReimbursement(req: Request, res: Response): Promise<void>;
    getActivityData(_req: Request, res: Response): Promise<void>;
}
export declare const financeController: FinanceController;
//# sourceMappingURL=finance.controller.d.ts.map