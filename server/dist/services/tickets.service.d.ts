export declare class TicketService {
    /**
     * Get tickets for an order
     */
    getOrderTickets(orderId: number, _userId?: string): Promise<{
        tickets: {
            ticket_id: any;
            ticket_number: any;
            event_id: any;
            event_title: any;
            status: any;
            qr_token: any;
            qr_data_url: string | null;
            issued_at: any;
            checked_in_at: any;
        }[];
    }>;
    /**
     * Check in a ticket by QR token
     */
    checkIn(qrToken: string, checkedInBy: string): Promise<{
        ticket_id: any;
        ticket_number: any;
        event_title: any;
        attendee_name: any;
        status: string;
        checked_in_at: any;
    }>;
}
export declare const ticketService: TicketService;
//# sourceMappingURL=tickets.service.d.ts.map