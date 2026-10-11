import { z } from 'zod';

export const getProductsSchema = z.object({
  query: z.object({
    type: z.enum(['event_ticket', 'goodie', 'merchandise']).optional(),
    event_id: z.string().transform(Number).optional(),
  }),
});
