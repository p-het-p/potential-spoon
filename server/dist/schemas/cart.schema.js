import { z } from 'zod';
export const addCartItemSchema = z.object({
    body: z.object({
        product_id: z.coerce.number().int().positive(),
        quantity: z.coerce.number().int().positive().max(10, 'Maximum 10 items per product'),
    }),
});
export const updateCartItemSchema = z.object({
    params: z.object({
        cartItemId: z.string().transform(Number),
    }),
    body: z.object({
        quantity: z.number().int().positive().max(10, 'Maximum 10 items per product'),
    }),
});
export const removeCartItemSchema = z.object({
    params: z.object({
        cartItemId: z.string().transform(Number),
    }),
});
//# sourceMappingURL=cart.schema.js.map