import { z } from 'zod';
export declare const updateProfileSchema: z.ZodObject<{
    body: z.ZodObject<{
        full_name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        full_name?: string | undefined;
        phone?: string | undefined;
    }, {
        full_name?: string | undefined;
        phone?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        full_name?: string | undefined;
        phone?: string | undefined;
    };
}, {
    body: {
        full_name?: string | undefined;
        phone?: string | undefined;
    };
}>;
//# sourceMappingURL=profile.schema.d.ts.map