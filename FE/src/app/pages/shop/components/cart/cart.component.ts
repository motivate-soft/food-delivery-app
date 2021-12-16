import { Component, Input, OnInit } from '@angular/core';
import { ShopQuery } from '@pages/shop/state/shop.query';
import { ShopService } from '@pages/shop/state/shop.service';

import { CartItem, Address } from '@pages/shop/state/shop.model';
import { MatDialog } from '@angular/material/dialog';
import { AddressDialogComponent } from '../address-dialog/address-dialog.component';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  
  cart:Array<CartItem>;
  cartOpened = false;
  address: Address;

  constructor(
    private shopQuery: ShopQuery,
    private shopService: ShopService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.shopQuery.cart$.subscribe( cart => {
      this.cart = cart
      if (this.cart.length == 0) this.cartOpened = false;
    } );
    this.shopQuery.address$.subscribe( address => this.address = address );
  }

  resetCart() {
    this.shopService.resetCart();
  }

  decreaseQty( itemIndex: number ) {
    const newQty = this.cart[ itemIndex ].quantity - 1;
    
    if( newQty < 1 ) {
      this.shopService.spliceCart( itemIndex );
    } 
    else {
      this.shopService.updateItemQuantity( itemIndex, newQty );
    }

  }

  increaseQty( itemIndex: number ) {
    const newQty = this.cart[ itemIndex ].quantity + 1;
    this.shopService.updateItemQuantity( itemIndex, newQty );
  }
  
  get cartCount() {
    return this.cart.length;
  }

  showCart() {
    this.cartOpened = true;
  }

  hideCart( event ) {
    const elem = event.srcElement;

    if( elem.id === 'cart-overlay' ) {
      this.cartOpened = false;
    }    
  }

  confirmOrder() {

    if (this.address) {
      this.onSubmitOrders(this.address);
    } else {
      const dialogRef = this.dialog.open(AddressDialogComponent, {
        maxWidth: '550px',
        data: {data: this.address },
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.shopService.addAddress(result);
          this.onSubmitOrders(result);
        }
      });
    }

  }

  onSubmitOrders(address: Address) {
    const shop_id = this.cart[0].shop_id;
    this.shopService.postConfirmCart({
      address: address,
      shop_id: shop_id,
      carts: this.cart,
      place: 'online'
    });
  }
}
