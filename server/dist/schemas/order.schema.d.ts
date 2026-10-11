import { z } from 'zod';
export declare const getOrdersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>;
        limit: z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>;
        status: z.ZodOptional<z.ZodEnum<["pending", "paid", "failed", "cancelled", "refunded"]>>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        status?: "pending" | "paid" | "failed" | "cancelled" | "refunded" | undefined;
    }, {
        status?: "pending" | "paid" | "failed" | "cancelled" | "refunded" | undefined;
        limit?: string | undefined;
        page?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        status?: "pending" | "paid" | "failed" | "cancelled" | "refunded" | undefined;
    };
}, {
    query: {
        status?: "pending" | "paid" | "failed" | "cancelled" | "refunded" | undefined;
        limit?: string | undefined;
        page?: string | undefined;
    };
}>;
export declare const getOrderSchema: z.ZodObject<{
    params: z.ZodObject<{
        orderId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        orderId: number;
    }, {
        orderId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        orderId: number;
    };
}, {
    params: {
        orderId: string;
    };
}>;
//# sourceMappingURL=order.schema.d.ts.map