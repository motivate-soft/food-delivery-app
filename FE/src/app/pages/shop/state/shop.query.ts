import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ShopStore, ShopState } from './shop.store';

@Injectable({ providedIn: 'root' })
export class ShopQuery extends QueryEntity<ShopState> {

  constructor(protected store: ShopStore) {
    super(store);
  }

  selectedCategoryIndex$ = this.select(state => state.ui.selectedCategoryIndex); // observable
  cart$ = this.select(state => state.ui.cart); // observable
  address$ = this.select(state => state.address);

  shop$ = this.select( state => {
    return Object.values( state.entities ).pop()
  });

  isLoading$ = this.selectLoading();
}
