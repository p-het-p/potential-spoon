import { z } from 'zod';
export declare const createEventSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        venue: z.ZodOptional<z.ZodString>;
        starts_at: z.ZodString;
        ends_at: z.ZodOptional<z.ZodString>;
        capacity: z.ZodNumber;
        is_public: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        starts_at: string;
        capacity: number;
        is_public: boolean;
        description?: string | undefined;
        venue?: string | undefined;
        ends_at?: string | undefined;
    }, {
        title: string;
        starts_at: string;
        capacity: number;
        description?: string | undefined;
        venue?: string | undefined;
        ends_at?: string | undefined;
        is_public?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        title: string;
        starts_at: string;
        capacity: number;
        is_public: boolean;
        description?: string | undefined;
        venue?: string | undefined;
        ends_at?: string | undefined;
    };
}, {
    body: {
        title: string;
        starts_at: string;
        capacity: number;
        description?: string | undefined;
        venue?: string | undefined;
        ends_at?: string | undefined;
        is_public?: boolean | undefined;
    };
}>;
export declare const updateEventSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        venue: z.ZodOptional<z.ZodString>;
        starts_at: z.ZodOptional<z.ZodString>;
        ends_at: z.ZodOptional<z.ZodString>;
        capacity: z.ZodOptional<z.ZodNumber>;
        is_public: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        title?: string | undefined;
        description?: string | undefined;
        venue?: string | undefined;
        starts_at?: string | undefined;
        ends_at?: string | undefined;
        capacity?: number | undefined;
        is_public?: boolean | undefined;
    }, {
        title?: string | undefined;
        description?: string | undefined;
        venue?: string | undefined;
        starts_at?: string | undefined;
        ends_at?: string | undefined;
        capacity?: number | undefined;
        is_public?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        title?: string | undefined;
        description?: string | undefined;
        venue?: string | undefined;
        starts_at?: string | undefined;
        ends_at?: string | undefined;
        capacity?: number | undefined;
        is_public?: boolean | undefined;
    };
}, {
    body: {
        title?: string | undefined;
        description?: string | undefined;
        venue?: string | undefined;
        starts_at?: string | undefined;
        ends_at?: string | undefined;
        capacity?: number | undefined;
        is_public?: boolean | undefined;
    };
}>;
export declare const getEventsSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>;
        limit: z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        search?: string | undefined;
    }, {
        limit?: string | undefined;
        page?: string | undefined;
        search?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        search?: string | undefined;
    };
}, {
    query: {
        limit?: string | undefined;
        page?: string | undefined;
        search?: string | undefined;
    };
}>;
//# sourceMappingURL=event.schema.d.ts.map