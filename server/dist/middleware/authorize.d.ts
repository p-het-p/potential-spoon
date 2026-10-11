import { Request, Response, NextFunction } from 'express';
export declare function authorize(...allowedRoles: string[]): (req: Request, _res: Response, next: NextFunction) => void;
export declare function isResourceOwner(userIdParam?: string): (req: Request, _res: Response, next: NextFunction) => void;
export declare const treasurerOnly: (req: Request, _res: Response, next: NextFunction) => void;
export declare const clubLeaderOnly: (req: Request, _res: Response, next: NextFunction) => void;
export declare const volunteerOrHigher: (req: Request, _res: Response, next: NextFunction) => void;
export declare const memberOrHigher: (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=authorize.d.ts.map