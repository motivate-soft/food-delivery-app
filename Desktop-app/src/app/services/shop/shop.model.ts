// tslint:disable-next-line: interface-name
export interface CartItem {
    _id: string;
    category_id: string;
    name: string;
    code: string;
    description: string;
    toppings?: Array<{ name: string, price:  number, idx: number}>;
    sort?: string;
    price: number;
    topping_price?: number;
    quantity: number;
    size: string;
    size_idx: number;
    tax?: number;
  }

  // tslint:disable-next-line: interface-name
  export interface Product {
    _id: string;
    category_id: string;
    code: string;
    name: string;
    description: string;
    sort_order: number;
    prices: number[];
    tax: number;
  }

  // tslint:disable-next-line: interface-name
  export interface Category {
    _id: string;
    name: string;
    is_active: boolean;
    is_offered: boolean;
    sizes?: Array<string>;
    toppings?: Array<{
      name: string;
      prices: number[]
    }>;
    products: Product[];
    tax?: number;
  }

  // tslint:disable-next-line: interface-name
  export interface Shop {
    _id: string;
    owner?: string;
    name: string;
    code: string;
    street: string;
    postal_code: string;
    city?: string;
    categories: Category[];
  }

  // tslint:disable-next-line: interface-name
  export interface Address {
    name: string;
    street: string;
    city: string;
    telephone?: string;
    remarks?: string;
  }

  // tslint:disable-next-line: interface-name
  export interface Customer {
    id: number;
    name: string;
    street: string;
    city: string;
    postal_code: string;
    telephone?: string;
  }

  // tslint:disable-next-line: interface-name
  export interface OrderItem {
    order_id: number;
    product_id: string | number;
    category_id: string | number;
    code: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    size: string;
    topping: string;
  }

  // tslint:disable-next-line: interface-name
  export interface Order {
    id: number;
    customer_id: number;
    name: string;
    street: string;
    city: string;
    telephone?: string;
    remarks?: string;
    ordered_at: string;
    order_total: number;
    order_items: OrderItem[];
  }

  // tslint:disable-next-line: interface-name
  export interface Driver {
    id: number;
    code: string;
    name?: string;
    telephone?: string;
  }

  // tslint:disable-next-line: interface-name
  export interface Settings {
    shop_name: string;
    street: string;
    postal_code: string;
    city: string;
    telephone: string;
    fax: string;
    tax_number: string;
    activation_key: string;
  }
