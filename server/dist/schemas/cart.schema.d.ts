import { z } from 'zod';
export declare const addCartItemSchema: z.ZodObject<{
    body: z.ZodObject<{
        product_id: z.ZodNumber;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        product_id: number;
        quantity: number;
    }, {
        product_id: number;
        quantity: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        product_id: number;
        quantity: number;
    };
}, {
    body: {
        product_id: number;
        quantity: number;
    };
}>;
export declare const updateCartItemSchema: z.ZodObject<{
    params: z.ZodObject<{
        cartItemId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        cartItemId: number;
    }, {
        cartItemId: string;
    }>;
    body: z.ZodObject<{
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
    }, {
        quantity: number;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        cartItemId: number;
    };
    body: {
        quantity: number;
    };
}, {
    params: {
        cartItemId: string;
    };
    body: {
        quantity: number;
    };
}>;
export declare const removeCartItemSchema: z.ZodObject<{
    params: z.ZodObject<{
        cartItemId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        cartItemId: number;
    }, {
        cartItemId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        cartItemId: number;
    };
}, {
    params: {
        cartItemId: string;
    };
}>;
//# sourceMappingURL=cart.schema.d.ts.map