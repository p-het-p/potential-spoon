export interface Cart {
    cart_id: number;
    user_id: string | null;
    attendee_id: number | null;
    status: string;
    created_at: Date;
    updated_at: Date;
}
export interface CartItem {
    cart_item_id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    added_at: Date;
}
export interface CartItemWithProduct extends CartItem {
    name: string;
    product_type: string;
}
export declare class CartRepository {
    findActiveCartByUserId(userId: string): Promise<Cart | null>;
    findActiveCartByAttendeeId(attendeeId: number): Promise<Cart | null>;
    createCart(params: {
        user_id?: string;
        attendee_id?: number;
    }): Promise<Cart>;
    getCartItems(cartId: number): Promise<CartItemWithProduct[]>;
    findCartItem(cartId: number, productId: number): Promise<CartItem | null>;
    findCartItemById(cartItemId: number): Promise<CartItem | null>;
    addCartItem(params: {
        cart_id: number;
        product_id: number;
        quantity: number;
        unit_price: number;
    }): Promise<CartItem>;
    updateCartItemQuantity(cartItemId: number, quantity: number): Promise<CartItem>;
    removeCartItem(cartItemId: number): Promise<void>;
    updateCartStatus(cartId: number, status: string): Promise<Cart>;
    clearCart(cartId: number): Promise<void>;
    getCartWithOwnerInfo(cartId: number): Promise<Cart | null>;
}
export declare const cartRepository: CartRepository;
//# sourceMappingURL=cart.repository.d.ts.map