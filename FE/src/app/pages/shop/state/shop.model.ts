export interface CartItem {
  product_id: string;
  product_name: string;
  product_code: string;
  product_description: string;
  toppings?: Array<string>;
  sort?: string;
  price: number;
  quantity: number;
}

export interface Product {
  _id: string;
  code: string;
  name: string;
  description: string;
  sort_order: number;
  prices: number[];
}

export interface Category {
  _id: string;
  name: string;
  is_active: boolean;
  is_offered: boolean;
  size?: Array<{
    name: string;
    description?: string;
  }>;
  toppings?: Array<{
    name: string;
    prices: number[]
  }>
  products: Product[];
}

export interface Shop {
  _id: string;
  name: string;
  code: string;
  street: string;
  postal_code: string;
  categories: Category[];
  working_hours?: Array<{
    _id: string;
    from: number;
    to: number;
  }>
}



export function createShop(params: Partial<Shop>) {
  return {

  } as Shop;
}
