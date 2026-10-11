import { Request, Response } from 'express';
export declare class MembershipController {
    getMembershipPlans(_req: Request, res: Response): Promise<void>;
    getUserMembership(req: Request, res: Response): Promise<void>;
    createMembership(req: Request, res: Response): Promise<void>;
}
export declare const membershipController: MembershipController;
//# sourceMappingURL=membership.controller.d.ts.map