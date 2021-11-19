export interface OrderItem {
    id: number;
    order_id: number;
    product_id: string;
    category_id: string;
    code: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    size: string;
    size_idx: number,
    toppings: string[]
}

export interface Order {
    id: number;
    name: string;
    street: string;
    city: string;
    telephone: string;
    remarks: string;
    ordered_at: string;
    order_total: number;
    order_items: OrderItem[];
}

export interface CreateOrderDto {
    name: string;
    street: string;
    city: string;
    telephone: string;
    remarks?: string;
    ordered_at: string;
    order_total: number;

    order_items: OrderItem[];
}

export interface UpdateOrderDto {
    name?: string;
    street?: string;
    city?: string;
    telephone?: string;
    remarks?: string;
    order_total?: number;
}