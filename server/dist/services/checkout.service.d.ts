type PaymentMethod = 'cash' | 'card' | 'upi' | 'bank_transfer';
export declare class CheckoutService {
    /**
     * Preview checkout totals without creating an order
     */
    preview(params: {
        userId?: string;
        attendeeId?: number;
    }): Promise<{
        items: {
            product_id: number;
            name: string;
            quantity: number;
            unit_price: number;
            total: number;
        }[];
        subtotal: number;
        total: number;
        currency: string;
    }>;
    /**
     * Complete a direct/manual payment.
     *
     * Razorpay is deliberately disabled for the current release. This records a
     * successful payment in the local database in the same transaction as the
     * order, inventory deduction, and ticket issuance.
     */
    checkout(params: {
        userId?: string;
        attendeeId?: number;
        paymentMethod: PaymentMethod;
    }): Promise<{
        order_id: any;
        amount: number;
        currency: string;
        payment_method: PaymentMethod;
        payment_status: string;
        message: string;
    }>;
}
export declare const checkoutService: CheckoutService;
export {};
//# sourceMappingURL=checkout.service.d.ts.map