import { z } from 'zod';
export declare const verifyPaymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        order_id: z.ZodNumber;
        razorpay_order_id: z.ZodString;
        razorpay_payment_id: z.ZodString;
        razorpay_signature: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        razorpay_signature: string;
        order_id: number;
        razorpay_order_id: string;
        razorpay_payment_id: string;
    }, {
        razorpay_signature: string;
        order_id: number;
        razorpay_order_id: string;
        razorpay_payment_id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        razorpay_signature: string;
        order_id: number;
        razorpay_order_id: string;
        razorpay_payment_id: string;
    };
}, {
    body: {
        razorpay_signature: string;
        order_id: number;
        razorpay_order_id: string;
        razorpay_payment_id: string;
    };
}>;
//# sourceMappingURL=payment.schema.d.ts.map