import { z } from 'zod';
export const verifyPaymentSchema = z.object({
    body: z.object({
        order_id: z.number().int().positive(),
        razorpay_order_id: z.string().min(1),
        razorpay_payment_id: z.string().min(1),
        razorpay_signature: z.string().min(1),
    }),
});
//# sourceMappingURL=payment.schema.js.map