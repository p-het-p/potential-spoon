import { z } from 'zod';
export declare const createMembershipSchema: z.ZodObject<{
    body: z.ZodObject<{
        plan_id: z.ZodNumber;
        student_id: z.ZodOptional<z.ZodString>;
        department: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        plan_id: number;
        student_id?: string | undefined;
        department?: string | undefined;
    }, {
        plan_id: number;
        student_id?: string | undefined;
        department?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        plan_id: number;
        student_id?: string | undefined;
        department?: string | undefined;
    };
}, {
    body: {
        plan_id: number;
        student_id?: string | undefined;
        department?: string | undefined;
    };
}>;
//# sourceMappingURL=membership.schema.d.ts.map