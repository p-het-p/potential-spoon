export interface Product {
    product_id: number;
    name: string;
    description: string | null;
    product_type: string;
    member_price: number;
    non_member_price: number | null;
    stock_quantity: number | null;
    is_active: boolean;
    created_at: Date;
    event_id: number | null;
}
export declare class ProductRepository {
    findAll(filters: {
        type?: string;
        event_id?: number;
    }): Promise<Product[]>;
    findById(id: number): Promise<Product | null>;
    getAvailableStock(productId: number): Promise<number | null>;
    create(data: {
        name: string;
        description?: string;
        product_type?: string;
        member_price: number;
        non_member_price?: number;
        stock_quantity?: number;
        is_active?: boolean;
        event_id?: number;
    }): Promise<Product>;
    update(id: number, data: Partial<Product>): Promise<Product | null>;
    delete(id: number): Promise<boolean>;
}
export declare const productRepository: ProductRepository;
//# sourceMappingURL=product.repository.d.ts.map