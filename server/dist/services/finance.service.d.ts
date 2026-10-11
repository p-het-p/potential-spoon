export declare class FinanceService {
    /**
     * Get financial summary
     */
    getSummary(filters: {
        start_date?: string;
        end_date?: string;
    }): Promise<{
        total_revenue: number;
        pending_payments: number;
        failed_payments: number;
        refunded: number;
        net_balance: number;
    }>;
    /**
     * List financial transactions
     */
    getTransactions(filters: {
        page: number;
        limit: number;
        purpose?: string;
        status?: string;
        start_date?: string;
        end_date?: string;
    }): Promise<{
        transactions: {
            id: number;
            purpose: string;
            amount: number;
            status: string;
            created_at: Date;
            paid_at: Date | null;
            order_id: number | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    /**
     * Get volunteer reimbursements / expenses
     */
    getReimbursements(): Promise<any[]>;
    /**
     * Update reimbursement status (approve, pay, reject)
     */
    updateReimbursement(id: string, status: string, note?: string): Promise<any>;
    /**
     * Get leader activity data (ticket sales, merchandise, fundraisers)
     */
    getActivityData(): Promise<{
        events: any[];
        merchandise: any[];
        fundraisers: any[];
    }>;
}
export declare const financeService: FinanceService;
//# sourceMappingURL=finance.service.d.ts.map