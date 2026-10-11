import { z } from 'zod';

export const createMembershipSchema = z.object({
  body: z.object({
    plan_id: z.number().int().positive(),
    student_id: z.string().max(50).optional(),
    department: z.string().max(100).optional(),
  }),
});
