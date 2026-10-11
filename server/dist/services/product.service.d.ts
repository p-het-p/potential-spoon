export declare class ProductService {
    getProducts(filters: {
        type?: string;
        event_id?: number;
    }): Promise<{
        products: {
            product_id: number;
            name: string;
            description: string | null;
            product_type: string;
            member_price: number;
            non_member_price: number | null;
            stock_quantity: number | null;
            is_active: boolean;
            event_id: number | null;
        }[];
    }>;
    getProductById(id: number): Promise<{
        product_id: number;
        name: string;
        description: string | null;
        product_type: string;
        member_price: number;
        non_member_price: number | null;
        stock_quantity: number | null;
        is_active: true;
        event_id: number | null;
    }>;
    checkAvailability(productId: number, quantity: number): Promise<boolean>;
}
export declare const productService: ProductService;
//# sourceMappingURL=product.service.d.ts.map