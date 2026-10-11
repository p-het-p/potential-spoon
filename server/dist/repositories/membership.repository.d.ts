export interface MembershipPlan {
    id: number;
    name: string;
    dues_amount: number;
    duration_days: number;
    is_active: boolean;
    created_at: Date | null;
    updated_at: Date | null;
}
export interface Membership {
    id: number;
    user_id: string;
    plan_id: number;
    student_id: string | null;
    department: string | null;
    status: string;
    start_date: Date | null;
    end_date: Date | null;
    registered_at: Date;
}
export declare class MembershipRepository {
    findAllPlans(): Promise<MembershipPlan[]>;
    findAllMemberships(): Promise<any[]>;
    findPlanById(id: number): Promise<MembershipPlan | null>;
    findActiveMembershipByUserId(userId: string): Promise<Membership | null>;
    createMembership(input: {
        user_id: string;
        plan_id: number;
        student_id?: string;
        department?: string;
    }): Promise<Membership>;
    updateMembershipStatus(id: number, status: string, startDate?: Date, endDate?: Date): Promise<Membership>;
}
export declare const membershipRepository: MembershipRepository;
//# sourceMappingURL=membership.repository.d.ts.map