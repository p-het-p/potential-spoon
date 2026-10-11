export declare class MembershipService {
    getMembershipPlans(): Promise<{
        plans: {
            id: number;
            name: string;
            dues_amount: number;
            duration_days: number;
            is_active: boolean;
        }[];
    }>;
    getUserMembership(userId: string): Promise<{
        id: number;
        status: string;
        plan_name: any;
        start_date: Date | null;
        end_date: Date | null;
        student_id: string | null;
        department: string | null;
    } | null>;
    createMembership(input: {
        userId: string;
        planId: number;
        studentId?: string;
        department?: string;
    }): Promise<{
        membership_id: number;
        status: string;
        plan_id: number;
        dues_amount: number;
    }>;
    activateMembership(membershipId: number): Promise<import("../repositories/membership.repository.js").Membership>;
}
export declare const membershipService: MembershipService;
//# sourceMappingURL=membership.service.d.ts.map