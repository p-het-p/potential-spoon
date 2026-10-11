import { query } from '../config/database.js';

export class TicketRepository {
  async findByOrderId(orderId: number) {
    const result = await query(
      `SELECT t.ticket_id, t.ticket_number, t.event_id, e.title as event_title,
              t.status, t.qr_token, t.issued_at, t.checked_in_at
       FROM event_tickets t
       JOIN events e ON t.event_id = e.id
       WHERE t.order_id = $1
       ORDER BY t.ticket_number`,
      [orderId]
    );
    return result;
  }

  async findByQrToken(qrToken: string) {
    const result = await query(
      `SELECT t.ticket_id, t.ticket_number, t.event_id, e.title as event_title,
              t.status, t.qr_token, t.issued_at, t.checked_in_at,
              COALESCE(u.full_name, g.full_name) as attendee_name
       FROM event_tickets t
       JOIN events e ON t.event_id = e.id
       LEFT JOIN orders o ON t.order_id = o.order_id
       LEFT JOIN users u ON o.user_id = u.user_id
       LEFT JOIN non_member_attendees g ON o.attendee_id = g.attendee_id
       WHERE t.qr_token = $1`,
      [qrToken]
    );
    return result[0] || null;
  }

  async checkIn(ticketId: number, _checkedInBy: string) {
    const result = await query(
      `UPDATE event_tickets
       SET status = 'used', checked_in_at = NOW()
       WHERE ticket_id = $1
       RETURNING *`,
      [ticketId]
    );
    return result[0];
  }
}

export const ticketRepository = new TicketRepository();
