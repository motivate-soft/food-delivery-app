import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Shop, CartItem } from './shop.model';

export interface ShopState extends EntityState<Shop> {

  ui: {
    selectedCategoryIndex: number,
    cart: Array<CartItem>
  }

}

const initialState = {
  ui: {
    selectedCategoryIndex: 0,
    cart: []
  }
};


@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'shop', idKey: '_id' })
export class ShopStore extends EntityStore<ShopState, Shop> {

  constructor() {
    super( initialState );
  }

}
