import { z } from 'zod';
export const createEventSchema = z.object({
    body: z.object({
        title: z.string().min(1).max(200),
        description: z.string().optional(),
        venue: z.string().max(200).optional(),
        starts_at: z.string().datetime(),
        ends_at: z.string().datetime().optional(),
        capacity: z.number().int().positive(),
        is_public: z.boolean().default(true),
    }),
});
export const updateEventSchema = z.object({
    body: z.object({
        title: z.string().min(1).max(200).optional(),
        description: z.string().optional(),
        venue: z.string().max(200).optional(),
        starts_at: z.string().datetime().optional(),
        ends_at: z.string().datetime().optional(),
        capacity: z.number().int().positive().optional(),
        is_public: z.boolean().optional(),
    }),
});
export const getEventsSchema = z.object({
    query: z.object({
        page: z.string().transform(Number).default('1'),
        limit: z.string().transform(Number).default('20'),
        search: z.string().optional(),
    }),
});
//# sourceMappingURL=event.schema.js.map