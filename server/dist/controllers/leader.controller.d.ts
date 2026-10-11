import { Request, Response } from 'express';
export declare function createFundraiser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getFundraisers(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateFundraiser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteFundraiser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function createVolunteerTask(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getVolunteerTasks(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateVolunteerTask(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteVolunteerTask(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function createAnnouncement(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getAnnouncements(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateAnnouncement(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteAnnouncement(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getMembers(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateMemberStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getAssignableUsers(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getMerchOrders(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getLeaderStats(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=leader.controller.d.ts.map