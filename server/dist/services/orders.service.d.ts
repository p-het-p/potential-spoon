export declare class OrderService {
    /**
     * List orders for a user or guest attendee
     */
    getUserOrders(params: {
        userId?: string;
        attendeeId?: number;
    }, filters: {
        page: number;
        limit: number;
        status?: string;
    }): Promise<{
        orders: {
            order_id: any;
            total_amount: number;
            currency: any;
            status: any;
            created_at: any;
            completed_at: any;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    /**
     * List all orders (for club_leader/treasurer)
     */
    getAllOrders(filters: {
        page: number;
        limit: number;
        status?: string;
    }): Promise<{
        orders: {
            order_id: any;
            total_amount: number;
            currency: any;
            status: any;
            created_at: any;
            completed_at: any;
            user_id: any;
            attendee_id: any;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    /**
     * Get order details with items
     */
    getOrderById(orderId: number, userId?: string, role?: string, attendeeId?: number): Promise<{
        order_id: any;
        total_amount: number;
        currency: any;
        status: any;
        created_at: any;
        completed_at: any;
        items: {
            order_item_id: any;
            product_id: any;
            product_name: any;
            quantity: any;
            unit_price: number;
            total_price: number;
        }[];
    }>;
}
export declare const orderService: OrderService;
//# sourceMappingURL=orders.service.d.ts.map