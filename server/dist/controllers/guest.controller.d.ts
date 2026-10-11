import { Request, Response } from 'express';
export declare class GuestController {
    register(req: Request, res: Response): Promise<void>;
    sendOtp(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response): Promise<void>;
}
export declare const guestController: GuestController;
//# sourceMappingURL=guest.controller.d.ts.map