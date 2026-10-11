import { z } from 'zod';
export declare const fundraiserSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    goal_amount: z.ZodDefault<z.ZodNumber>;
    current_amount: z.ZodDefault<z.ZodNumber>;
    status: z.ZodDefault<z.ZodEnum<["planning", "active", "completed"]>>;
}, "strip", z.ZodTypeAny, {
    status: "active" | "planning" | "completed";
    title: string;
    goal_amount: number;
    current_amount: number;
    description?: string | undefined;
}, {
    title: string;
    status?: "active" | "planning" | "completed" | undefined;
    description?: string | undefined;
    goal_amount?: number | undefined;
    current_amount?: number | undefined;
}>;
export declare const updateFundraiserSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    goal_amount: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    current_amount: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["planning", "active", "completed"]>>>;
}, "strip", z.ZodTypeAny, {
    status?: "active" | "planning" | "completed" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    goal_amount?: number | undefined;
    current_amount?: number | undefined;
}, {
    status?: "active" | "planning" | "completed" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    goal_amount?: number | undefined;
    current_amount?: number | undefined;
}>;
export declare const volunteerTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    assigned_to: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    fundraiser_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    deadline: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<["pending", "in_progress", "completed", "declined"]>>;
    decline_reason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "completed" | "in_progress" | "declined";
    title: string;
    description?: string | undefined;
    assigned_to?: string | null | undefined;
    fundraiser_id?: string | null | undefined;
    deadline?: string | null | undefined;
    decline_reason?: string | null | undefined;
}, {
    title: string;
    status?: "pending" | "completed" | "in_progress" | "declined" | undefined;
    description?: string | undefined;
    assigned_to?: string | null | undefined;
    fundraiser_id?: string | null | undefined;
    deadline?: string | null | undefined;
    decline_reason?: string | null | undefined;
}>;
export declare const updateVolunteerTaskSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    assigned_to: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    fundraiser_id: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    deadline: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["pending", "in_progress", "completed", "declined"]>>>;
    decline_reason: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
}, "strip", z.ZodTypeAny, {
    status?: "pending" | "completed" | "in_progress" | "declined" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    assigned_to?: string | null | undefined;
    fundraiser_id?: string | null | undefined;
    deadline?: string | null | undefined;
    decline_reason?: string | null | undefined;
}, {
    status?: "pending" | "completed" | "in_progress" | "declined" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    assigned_to?: string | null | undefined;
    fundraiser_id?: string | null | undefined;
    deadline?: string | null | undefined;
    decline_reason?: string | null | undefined;
}>;
export declare const taskExpenseSchema: z.ZodObject<{
    amount: z.ZodNumber;
    description: z.ZodString;
    receipt_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    description: string;
    amount: number;
    receipt_url?: string | null | undefined;
}, {
    description: string;
    amount: number;
    receipt_url?: string | null | undefined;
}>;
export declare const announcementSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    audience: z.ZodDefault<z.ZodEnum<["all", "members"]>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    audience: "all" | "members";
}, {
    title: string;
    content: string;
    audience?: "all" | "members" | undefined;
}>;
export declare const updateAnnouncementSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    audience: z.ZodOptional<z.ZodDefault<z.ZodEnum<["all", "members"]>>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    content?: string | undefined;
    audience?: "all" | "members" | undefined;
}, {
    title?: string | undefined;
    content?: string | undefined;
    audience?: "all" | "members" | undefined;
}>;
//# sourceMappingURL=leader.schema.d.ts.map