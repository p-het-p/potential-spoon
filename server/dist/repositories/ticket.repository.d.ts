export declare class TicketRepository {
    findByOrderId(orderId: number): Promise<any[]>;
    findByQrToken(qrToken: string): Promise<any>;
    checkIn(ticketId: number, _checkedInBy: string): Promise<any>;
}
export declare const ticketRepository: TicketRepository;
//# sourceMappingURL=ticket.repository.d.ts.map