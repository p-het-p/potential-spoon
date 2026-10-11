import { z } from 'zod';
export const updateProfileSchema = z.object({
    body: z.object({
        full_name: z
            .string()
            .min(2, 'Name must be at least 2 characters')
            .max(150, 'Name must not exceed 150 characters')
            .optional(),
        phone: z
            .string()
            .regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format')
            .optional(),
    }),
});
//# sourceMappingURL=profile.schema.js.map