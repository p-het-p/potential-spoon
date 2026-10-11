export interface Payment {
    id: number;
    order_id: number | null;
    user_id: string | null;
    membership_id: number | null;
    amount: number;
    currency: string;
    purpose: string;
    status: string;
    razorpay_payment_id: string | null;
    razorpay_order_id: string | null;
    razorpay_signature: string | null;
    created_at: Date;
    paid_at: Date | null;
}
export declare class PaymentRepository {
    create(params: {
        order_id?: number;
        user_id?: string;
        membership_id?: number;
        amount: number;
        currency?: string;
        purpose: string;
        razorpay_order_id?: string;
    }): Promise<Payment>;
    findById(id: number): Promise<Payment | null>;
    findByOrderId(orderId: number): Promise<Payment | null>;
    findByRazorpayOrderId(razorpayOrderId: string): Promise<Payment | null>;
    updatePaymentStatus(id: number, status: string, razorpayPaymentId?: string, razorpaySignature?: string): Promise<Payment>;
    findTransactions(filters: {
        page: number;
        limit: number;
        purpose?: string;
        status?: string;
        start_date?: string;
        end_date?: string;
    }): Promise<{
        transactions: Payment[];
        total: number;
    }>;
    getFinancialSummary(startDate?: string, endDate?: string): Promise<{
        total_revenue: number;
        pending_payments: number;
        failed_payments: number;
        refunded: number;
        net_balance: number;
    }>;
}
export declare const paymentRepository: PaymentRepository;
//# sourceMappingURL=payment.repository.d.ts.map