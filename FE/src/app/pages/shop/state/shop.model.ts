export interface CartItem {
  shop_id?: string;
  product_id: string;
  product_name: string;
  product_code: string;
  product_description: string;
  toppings?: Array<{
    _id: string;
    name: string;
    price: number;
    size: string;
  }>;
  sort?: string;
  price: number;
  category_id: string;
  tax: number;
  quantity: number;
  size: string;
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
  sizes?: string[];
  toppings?: Array<Topping>;
  products: Product[];
  tax?: number;
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

export interface ProductItem {
  shop_id: string;
  category_id: string;
  category_name: string;
  sizes: Array<string>;
  product: Product;
  toppings: Array<Topping>
  tax: number;
  quantity?: number;
}

export interface Topping {
  name: string;
  prices: number[];
  _id: string;
  selected?: boolean;
  selectedPrice?: number;
}



export function createShop(params: Partial<Shop>) {
  return {

  } as Shop;
}
