import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { CartItem, Shop } from './shop.model';
import { ShopStore } from './shop.store';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../../common/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app_/common/confirm-dialog/confirm-dialog.component';
@Injectable({ providedIn: 'root' })
export class ShopService {

  constructor(
    private shopStore: ShopStore, 
    private http: HttpClient, 
    private notificationService: NotificationService,
    public dialog: MatDialog) {}

  setLoading( isLoading: boolean ) {
    this.shopStore.setLoading( isLoading );
  }

  updateSelectedCategoryIndex( index: number ) {
    this.shopStore.update(( state) => {
      const ui = {...state.ui};
      ui.selectedCategoryIndex = index;

      return {
        ...state,
        ui
      }
    });
  }

  addToCart( cartItem: CartItem ) {
    this.shopStore.update(( state) => {
      const newState = {...state };
      const cart = [...state.ui.cart, cartItem ];
      newState.ui = { ...newState.ui, cart }

      return newState;
    });
  }

  spliceCart( index: number ) {
    this.shopStore.update(( state) => {
      const newState = {...state };
      const cart = [...state.ui.cart ];
      cart.splice( index, 1 );
      newState.ui = { ...newState.ui, cart }
      return newState;
    });
  }

  resetCart() {
    this.shopStore.update(( state) => {
      const newState = {...state };
      newState.ui = { ...newState.ui, cart: [] }
      return newState;
    });
  }

  updateItemQuantity( itemIndex: number, newQty: number ) {
    this.shopStore.update(( state) => {
      const newState = {...state };
      const cart = [...newState.ui.cart ];
      cart[ itemIndex ].quantity = newQty; 
      newState.ui = { ...newState.ui, cart: [...cart] }
      return newState;
    });
  }


  getShop() {
    return this.http.get<Shop>(`${environment.server}/api/shop/getShop`).pipe(tap( (response: any ) => {
      const shop = response.data;
      const entity = {
        [shop._id]: shop
      };

      this.shopStore.set( entity );
    })).subscribe();
  }

  postConfirmCart(cart: {
    shop_id: string,
    carts: Array<CartItem>
  }) {
    return this.http.post(`${environment.server}/api/shop/confirmCart`, cart).pipe(tap( (response: any ) => {
      if (!response.error) {
        this.resetCart();

        this.dialog.open(ConfirmDialogComponent, {
          width: '450px',
          data: {
            message1: 'Vielen Dank für Ihre Bestellung',
            message2:  `Ihre Bestellung ist abgeschlossen und wird nun unter der Nummer ${response.orderId} geführt.`
          },
        });

      } else {
        this.notificationService.showNotification('warning', response.message);
      }
    })).subscribe();
  }
 
}
