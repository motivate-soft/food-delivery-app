import { Injectable } from "@angular/core";
import { Application } from "./application.model";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { CartItem, Category, Product, Address, Customer, Order, Driver, Settings, Shop } from "../services/shop/shop.model";


// tslint:disable-next-line: interface-name
export interface ApplicationState extends EntityState<Application> {
    shop: Shop;
    cart: Array<CartItem>;
    category: Category;
    filter: string;
    products: Product[];
    categories: { [key: string]: Category };
    selected_cart_item: number;
    address: Address;
    customers: Customer[];
    orders: Order[];
    drivers: Driver[];
    settings: Settings;
 }

const initialState = {
    shop: null,
    cart: [],
    category: null,
    filter: "",
    products: [],
    customers: [],
    orders: [],
    drivers: [],
    settings: null,
    categories: {},
    selected_cart_item: 0,
    address: null
};

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "application" })
export class ApplicationStore extends EntityStore<ApplicationState> {

  constructor() {
    super(initialState);
  }

}

