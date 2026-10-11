type CartOwner = {
    userId?: string;
    attendeeId?: number;
};
export declare const cartService: {
    getCart(owner: CartOwner): Promise<{
        items: never[];
        subtotal: number;
        currency: string;
        cart_id?: undefined;
    } | {
        cart_id: number;
        items: {
            unit_price: number;
            total: number;
            name: string;
            product_type: string;
            cart_item_id: number;
            cart_id: number;
            product_id: number;
            quantity: number;
            added_at: Date;
        }[];
        subtotal: number;
        currency: string;
    }>;
    addItem(params: CartOwner & {
        productId: number;
        quantity: number;
    }): Promise<import("../repositories/cart.repository.js").CartItem>;
    updateItemQuantity(params: CartOwner & {
        cartItemId: number;
        quantity: number;
    }): Promise<import("../repositories/cart.repository.js").CartItem>;
    removeItem(params: CartOwner & {
        cartItemId: number;
    }): Promise<void>;
};
export {};
//# sourceMappingURL=cart.service.d.ts.map