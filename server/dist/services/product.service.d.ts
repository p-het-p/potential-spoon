export declare class ProductService {
    getProducts(filters: {
        type?: string;
        event_id?: number;
    }): Promise<{
        products: {
            product_id: any;
            name: any;
            description: any;
            product_type: any;
            member_price: number;
            non_member_price: number;
            stock_quantity: any;
            is_active: any;
            event_id: any;
        }[];
    }>;
    getProductById(id: number): Promise<{
        product_id: any;
        name: any;
        description: any;
        product_type: any;
        member_price: number;
        non_member_price: number;
        stock_quantity: any;
        is_active: any;
        event_id: any;
    }>;
    checkAvailability(productId: number, quantity: number): Promise<boolean>;
    createProduct(data: any): Promise<{
        product_id: any;
        name: any;
        description: any;
        product_type: any;
        member_price: number;
        non_member_price: number;
        stock_quantity: any;
        is_active: any;
        event_id: any;
    }>;
    updateProduct(id: number, data: any): Promise<{
        product_id: any;
        name: any;
        description: any;
        product_type: any;
        member_price: number;
        non_member_price: number;
        stock_quantity: any;
        is_active: any;
        event_id: any;
    }>;
    deleteProduct(id: number): Promise<{
        success: boolean;
    }>;
}
export declare const productService: ProductService;
//# sourceMappingURL=product.service.d.ts.map