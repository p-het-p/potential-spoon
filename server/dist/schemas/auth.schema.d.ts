import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        full_name: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        password: string;
        email: string;
        full_name: string;
        phone?: string | undefined;
    }, {
        password: string;
        email: string;
        full_name: string;
        phone?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        password: string;
        email: string;
        full_name: string;
        phone?: string | undefined;
    };
}, {
    body: {
        password: string;
        email: string;
        full_name: string;
        phone?: string | undefined;
    };
}>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        password: string;
        email: string;
    }, {
        password: string;
        email: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        password: string;
        email: string;
    };
}, {
    body: {
        password: string;
        email: string;
    };
}>;
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
//# sourceMappingURL=auth.schema.d.ts.map