import { z } from 'zod';

export const checkoutSchema = z.object({
  body: z.object({
    payment_method: z.enum(['cash', 'card', 'upi', 'bank_transfer']).default('cash'),
  }),
});
