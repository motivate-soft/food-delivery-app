import { Component, Input, OnInit } from "@angular/core";
import { CartItem, Category } from "../../../../services/shop/shop.model";
import { ApplicationQuery } from "../../../../state/application.query";
import { ApplicationService } from "../../../../state/application.service";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"]
})
export class OrderComponent implements OnInit {

  cart: CartItem[] = [];
  categories: { [ key: string]: Category } = {};
  selectedItem = 0;

  // tslint:disable-next-line: typedef
  get total() {
    return this.cart.reduce( (acc, item) => {
      acc += item.price * item.quantity;
      // tslint:disable-next-line: typedef
      let toppingPrice = 0;
      item.toppings.forEach(element => {
        toppingPrice += element.price * item.quantity;
      });
      return acc + toppingPrice;
    }, 0 );
  }

  constructor(
    private readonly applicationQuery: ApplicationQuery,
    private readonly applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
    this.applicationQuery.cart$.subscribe( cart => {
      this.cart = cart;
    });

    this.applicationQuery.selected_cart_item$.subscribe( selected_cart_item => this.selectedItem = selected_cart_item);
    this.applicationQuery.categories$.subscribe( categories => this.categories = categories );
  }

  // tslint:disable-next-line: typedef
  increaseQty(idx) {
    const cartItem: CartItem = { ...this.cart[ idx ] };
    cartItem.quantity += 1;
    this.applicationService.updateCartItem( idx, cartItem );
  }

  // tslint:disable-next-line: typedef
  decreaseQty( idx ) {
    const cartItem: CartItem = { ...this.cart[ idx ] };
    cartItem.quantity = cartItem.quantity === 1 ? cartItem.quantity : cartItem.quantity -1;
    this.applicationService.updateCartItem( idx, cartItem );
  }

  // tslint:disable-next-line: typedef
  selectItem( idx: number ) {
    // tslint:disable-next-line: typedef
    const category_id = this.cart[ idx ].category_id;
    // tslint:disable-next-line: typedef
    const category = this.categories[ category_id ];

    this.applicationService.setSelectedCartItem( idx );
    this.applicationService.setCategory( category );
  }

  // tslint:disable-next-line: typedef
  deleteTopping( idx: number, cartItem: CartItem) {
    cartItem.toppings.splice( idx, 1);

    this.applicationService.updateCartItem( this.selectedItem, cartItem );
  }

  // tslint:disable-next-line: typedef
  price( item: CartItem ) {
    // tslint:disable-next-line: typedef
    let topping_price = 0;
    if (item.category_id)
    item.toppings.forEach(element => {
      topping_price += element.price * item.quantity;
    });
    return item.price * item.quantity + topping_price;
  }

}
