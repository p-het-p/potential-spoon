import { ticketService } from '../services/tickets.service.js';
export class TicketController {
    async getOrderTickets(req, res) {
        const userId = req.user?.userId;
        const orderId = Number(req.params.orderId);
        const result = await ticketService.getOrderTickets(orderId, userId);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    async checkIn(req, res) {
        const userId = req.user?.userId;
        const { qr_token } = req.body;
        const result = await ticketService.checkIn(qr_token, userId);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
}
export const ticketController = new TicketController();
//# sourceMappingURL=tickets.controller.js.map