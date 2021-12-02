import { Injectable } from "@angular/core";
import { ID, StateHistoryPlugin } from "@datorama/akita";
import { HttpClient } from "@angular/common/http";
import { ApplicationStore } from "./application.store";
import { Application } from "./application.model";
import { tap } from "rxjs/operators";
import { Address, CartItem, Category, Customer, Order, Product, Settings, Shop } from "../services/shop/shop.model";

@Injectable({ providedIn: "root" })
export class ApplicationService {

  constructor(private applicationStore: ApplicationStore) {
  }

  // tslint:disable-next-line: typedef
  addToCart( item: CartItem ) {
    this.applicationStore.update( (state) => {
      // tslint:disable-next-line: typedef
      const cart = [...state.cart];
      cart.push( item );

      return {
        ...state,
        cart,
        selected_cart_item: cart.length - 1
      };
    });
  }

  // tslint:disable-next-line: typedef
  updateAddress( address: Address) {
    this.applicationStore.update( (state) => {
      return {
        ...state,
        address
      };
    });
  }

  updateCartItem( idx: number, item: CartItem) {
    this.applicationStore.update( (state) => {
      const cart = [...state.cart];
      cart.splice( idx, 1, item );

      return {
        ...state,
        cart
      }
    });
  }

  setSelectedCartItem( idx: number ) {
    this.applicationStore.update( (state) => {
      return {
        ...state,
        selected_cart_item: idx
      }
    });
  }

  // tslint:disable-next-line: typedef
  setCategory( category: Category ) {
    this.applicationStore.update( (state) => {
      return {
        ...state,
        category
      };
    });
  }

  // tslint:disable-next-line: typedef
  setFilter( filter: string ) {
    this.applicationStore.update( (state) => {
      return {
        ...state,
        filter
      };
    });

  }

  setShop( shop: Shop ) {
    this.applicationStore.update( (state) => {
      return {
        ...state,
        shop
      }
    });
  }

  setProducts( products: Product[] ) {
    this.applicationStore.update( (state) => {
      return {
        ...state,
        products
      }
    });
  }

  setCategories( categories: { [key: string]: Category } ) {
    this.applicationStore.update( (state) => {
      return {
        ...state,
        categories
      }
    });
  }

  setCustomers( customers: Customer[] ) {
    this.applicationStore.update( (state) => {
      return {
        ...state,
        customers
      }
    });

  }

  insertCustomer( customer: Customer ) {
    this.applicationStore.update( (state) => {
      const customers: Array<Customer> = JSON.parse(JSON.stringify(state.customers));

      customers.push( customer );

      return {
        ...state,
        customers
      }
    });
  }

  updateCustomer( id: number, customer: Customer ) {

      this.applicationStore.update( (state) => {
        let  customers = [...state.customers];
        const idx = customers.findIndex( customer => customer.id === id );
        customers = customers.splice( idx, 1, customer)
        return {
          ...state,
          customers
        }
      });
  
  }

  setOrders( orders: Order[] ) {
    this.applicationStore.update( (state) => {
      return {
        ...state,
        orders
      }
    });

  }

  setDrivers( products: Product[] ) {
    this.applicationStore.update( (state) => {
      return {
        ...state,
        products
      }
    });

  }

  setSettings( settings: Settings ) {
    this.applicationStore.update( (state) => {
      return {
        ...state,
        settings
      }
    });

  }
}
