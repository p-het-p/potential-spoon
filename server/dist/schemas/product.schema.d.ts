import { z } from 'zod';
export declare const getProductsSchema: z.ZodObject<{
    query: z.ZodObject<{
        type: z.ZodOptional<z.ZodEnum<["event_ticket", "goodie", "merchandise"]>>;
        event_id: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    }, "strip", z.ZodTypeAny, {
        type?: "event_ticket" | "goodie" | "merchandise" | undefined;
        event_id?: number | undefined;
    }, {
        type?: "event_ticket" | "goodie" | "merchandise" | undefined;
        event_id?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        type?: "event_ticket" | "goodie" | "merchandise" | undefined;
        event_id?: number | undefined;
    };
}, {
    query: {
        type?: "event_ticket" | "goodie" | "merchandise" | undefined;
        event_id?: string | undefined;
    };
}>;
//# sourceMappingURL=product.schema.d.ts.map