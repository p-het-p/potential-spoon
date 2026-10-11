import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                role: string;
            };
            guest?: {
                attendeeId: number;
                email: string;
                sessionId: string;
            };
        }
    }
}
export declare function authenticate(req: Request, _res: Response, next: NextFunction): void;
export declare function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=authenticate.d.ts.map