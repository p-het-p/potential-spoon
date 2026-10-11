import { z } from 'zod';
export const getOrdersSchema = z.object({
    query: z.object({
        page: z.string().transform(Number).default('1'),
        limit: z.string().transform(Number).default('20'),
        status: z.enum(['pending', 'paid', 'failed', 'cancelled', 'refunded']).optional(),
    }),
});
export const getOrderSchema = z.object({
    params: z.object({
        orderId: z.string().transform(Number),
    }),
});
//# sourceMappingURL=order.schema.js.map