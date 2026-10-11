import { Router } from 'express';
import { ticketController } from '../controllers/tickets.controller.js';
import { validate } from '../middleware/validate.js';
import { checkInTicketSchema } from '../schemas/ticket.schema.js';
import { authenticate } from '../middleware/authenticate.js';
import { volunteerOrHigher } from '../middleware/authorize.js';
const router = Router();
// Get tickets for an order (nested under /orders/:orderId/tickets in app.ts)
// This route is mounted directly as /tickets for check-in
// The order tickets endpoint is registered separately in app.ts
// Check in a ticket by QR token (volunteer, club_leader, treasurer only)
router.post('/check-in', authenticate, volunteerOrHigher, validate(checkInTicketSchema), (req, res, next) => ticketController.checkIn(req, res).catch(next));
export default router;
//# sourceMappingURL=tickets.routes.js.map