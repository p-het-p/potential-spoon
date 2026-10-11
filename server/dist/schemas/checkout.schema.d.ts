import { z } from 'zod';
export declare const checkoutSchema: z.ZodObject<{
    body: z.ZodObject<{
        payment_method: z.ZodDefault<z.ZodEnum<["cash", "card", "upi", "bank_transfer"]>>;
    }, "strip", z.ZodTypeAny, {
        payment_method: "cash" | "card" | "upi" | "bank_transfer";
    }, {
        payment_method?: "cash" | "card" | "upi" | "bank_transfer" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        payment_method: "cash" | "card" | "upi" | "bank_transfer";
    };
}, {
    body: {
        payment_method?: "cash" | "card" | "upi" | "bank_transfer" | undefined;
    };
}>;
//# sourceMappingURL=checkout.schema.d.ts.map