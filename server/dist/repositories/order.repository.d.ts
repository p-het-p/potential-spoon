export interface OrderFilters {
    page: number;
    limit: number;
    status?: string;
}
export declare class OrderRepository {
    findByUserId(userId: string, filters: OrderFilters): Promise<{
        orders: any[];
        total: number;
    }>;
    findByAttendeeId(attendeeId: number, filters: OrderFilters): Promise<{
        orders: any[];
        total: number;
    }>;
    findAllOrders(filters: OrderFilters): Promise<{
        orders: any[];
        total: number;
    }>;
    findById(orderId: number): Promise<any>;
    getOrderItems(orderId: number): Promise<any[]>;
}
export declare const orderRepository: OrderRepository;
//# sourceMappingURL=order.repository.d.ts.map