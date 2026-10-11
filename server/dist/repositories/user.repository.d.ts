export interface User {
    user_id: string;
    email: string;
    password_hash: string;
    full_name: string;
    phone: string | null;
    role: string;
    created_at: Date;
}
export interface CreateUserInput {
    email: string;
    password_hash: string;
    full_name: string;
    phone?: string;
    role?: string;
}
export declare class UserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(userId: string): Promise<User | null>;
    create(input: CreateUserInput): Promise<User>;
    update(userId: string, updates: Partial<User>): Promise<User>;
}
export declare const userRepository: UserRepository;
//# sourceMappingURL=user.repository.d.ts.map