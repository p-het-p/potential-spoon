import { ticketRepository } from '../repositories/ticket.repository.js';
import { AppError } from '../middleware/errorHandler.js';
import { generateQrDataUrl } from '../integrations/qr.js';
import logger from '../utils/logger.js';

export class TicketService {
  /**
   * Get tickets for an order
   */
  async getOrderTickets(orderId: number, _userId?: string) {
    const tickets = await ticketRepository.findByOrderId(orderId);

    const ticketList = await Promise.all(
      tickets.map(async (ticket) => {
        let qrDataUrl: string | null = null;
        if (ticket.qr_token) {
          try {
            qrDataUrl = await generateQrDataUrl(ticket.qr_token);
          } catch {
            qrDataUrl = null;
          }
        }
        return {
          ticket_id: ticket.ticket_id,
          ticket_number: ticket.ticket_number,
          event_id: ticket.event_id,
          event_title: ticket.event_title,
          status: ticket.status,
          qr_token: ticket.qr_token,
          qr_data_url: qrDataUrl,
          issued_at: ticket.issued_at,
          checked_in_at: ticket.checked_in_at,
        };
      })
    );

    return {
      tickets: ticketList,
    };
  }

  /**
   * Check in a ticket by QR token
   */
  async checkIn(qrToken: string, checkedInBy: string) {
    const ticket = await ticketRepository.findByQrToken(qrToken);

    if (!ticket) {
      throw new AppError(404, 'TICKET_NOT_FOUND', 'Ticket not found');
    }

    if (ticket.status === 'used') {
      throw new AppError(400, 'TICKET_ALREADY_USED', 'Ticket has already been checked in');
    }

    if (ticket.status !== 'active') {
      throw new AppError(400, 'TICKET_NOT_ACTIVE', `Ticket status is: ${ticket.status}`);
    }

    const updatedTicket = await ticketRepository.checkIn(ticket.ticket_id, checkedInBy);

    logger.info('Ticket checked in', {
      ticketId: ticket.ticket_id,
      ticketNumber: ticket.ticket_number,
      checkedInBy,
    });

    return {
      ticket_id: updatedTicket.ticket_id,
      ticket_number: ticket.ticket_number,
      event_title: ticket.event_title,
      attendee_name: ticket.attendee_name,
      status: 'used',
      checked_in_at: updatedTicket.checked_in_at,
    };
  }
}

export const ticketService = new TicketService();
