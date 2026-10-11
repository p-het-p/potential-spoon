import { Request, Response } from 'express';
export declare class EventController {
    getEvents(req: Request, res: Response): Promise<void>;
    getEventById(req: Request, res: Response): Promise<void>;
    createEvent(req: Request, res: Response): Promise<void>;
    updateEvent(req: Request, res: Response): Promise<void>;
    deleteEvent(req: Request, res: Response): Promise<void>;
}
export declare const eventController: EventController;
//# sourceMappingURL=event.controller.d.ts.map