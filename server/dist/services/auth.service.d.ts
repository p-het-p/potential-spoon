export interface RegisterInput {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
}
export interface LoginInput {
    email: string;
    password: string;
}
export interface AuthResponse {
    token: string;
    user: {
        user_id: string;
        email: string;
        full_name: string;
        role: string;
    };
}
export declare class AuthService {
    register(input: RegisterInput): Promise<AuthResponse>;
    login(input: LoginInput): Promise<AuthResponse>;
    private generateToken;
    verifyToken(token: string): any;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map