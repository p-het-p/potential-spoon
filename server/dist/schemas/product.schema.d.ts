import { z } from 'zod';
export declare const getProductsSchema: z.ZodObject<{
    query: z.ZodObject<{
        type: z.ZodOptional<z.ZodEnum<["event_ticket", "goodie", "merchandise"]>>;
        event_id: z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, unknown>;
    }, "strip", z.ZodTypeAny, {
        type?: "merchandise" | "event_ticket" | "goodie" | undefined;
        event_id?: number | undefined;
    }, {
        type?: "merchandise" | "event_ticket" | "goodie" | undefined;
        event_id?: unknown;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        type?: "merchandise" | "event_ticket" | "goodie" | undefined;
        event_id?: number | undefined;
    };
}, {
    query: {
        type?: "merchandise" | "event_ticket" | "goodie" | undefined;
        event_id?: unknown;
    };
}>;
//# sourceMappingURL=product.schema.d.ts.map