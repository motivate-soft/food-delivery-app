import { Component, Input, OnInit } from "@angular/core";
import { CartItem, Category } from "../../../../services/shop/shop.model";
import { ApplicationQuery } from "../../../../state/application.query";
import { ApplicationService } from "../../../../state/application.service";

@Component({
  selector: "app-ingredients",
  templateUrl: "./ingredients.component.html",
  styleUrls: ["./ingredients.component.scss"]
})
export class IngredientsComponent implements OnInit {

  category: Category;
  cart: CartItem[];
  selected_cart_item: number;

  constructor(
    private readonly applicationQuery: ApplicationQuery,
    private readonly applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
    this.applicationQuery.category$.subscribe( category => {
      if( category ) {
        this.category = category;
      }
    });

    this.applicationQuery.cart$.subscribe( cart => {
      if( cart ) {
        this.cart = cart;
      }
    });

    this.applicationQuery.selected_cart_item$.subscribe( selected_cart_item => {
      this.selected_cart_item = selected_cart_item;
    });
  }

  // tslint:disable-next-line: typedef
  addTopping( idx: number ) {
    // tslint:disable-next-line: typedef
    const cartItem = this.cart[ this.selected_cart_item ];
    // tslint:disable-next-line: typedef
    const size_idx = cartItem.size_idx;
    // tslint:disable-next-line: typedef
    const topping = this.category.toppings[ idx ];

    cartItem.toppings.push({ name: topping.name, price: topping.prices[ size_idx ], idx: size_idx });

    this.applicationService.updateCartItem( this.selected_cart_item, cartItem);
  }

}
