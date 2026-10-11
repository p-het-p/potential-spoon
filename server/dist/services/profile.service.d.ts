export interface UpdateProfileInput {
    full_name?: string;
    phone?: string;
}
export declare class ProfileService {
    getProfile(userId: string): Promise<{
        user_id: string;
        email: string;
        full_name: string;
        phone: string | null;
        role: string;
        created_at: Date;
    }>;
    updateProfile(userId: string, updates: UpdateProfileInput): Promise<{
        user_id: string;
        email: string;
        full_name: string;
        phone: string | null;
        role: string;
    }>;
}
export declare const profileService: ProfileService;
//# sourceMappingURL=profile.service.d.ts.map