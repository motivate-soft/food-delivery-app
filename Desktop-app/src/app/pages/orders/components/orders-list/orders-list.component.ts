import { Component, OnInit, OnDestroy } from "@angular/core";
import { CartItem, Category, Shop } from "../../../../services/shop/shop.model";
import { ApplicationQuery } from "../../../../state/application.query";
import { ApplicationService } from "../../../../state/application.service";
import { WebSocketService } from "../../../../services/web-socket.service";

@Component({
  selector: "app-orders-list",
  templateUrl: "./orders-list.component.html",
  styleUrls: ["./orders-list.component.scss"]
})
export class OrdersListComponent implements OnInit, OnDestroy {

  cart: CartItem[] = [];
  onlineCart: CartItem[] = [];

  categories: { [ key: string]: Category } = {};
  selectedItem = 0;

  shop!: Shop;
  receiveOrdersObs: any;

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
    private readonly applicationService: ApplicationService,
    private webSocketService: WebSocketService
  ) { }

  ngOnDestroy(): void {
    if (this.receiveOrdersObs !== undefined) {
      this.receiveOrdersObs.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.applicationQuery.cart$.subscribe( cart => {
      this.cart = cart;
    });

    this.applicationQuery.selected_cart_item$.subscribe( selected_cart_item => this.selectedItem = selected_cart_item);
    this.applicationQuery.categories$.subscribe( categories => this.categories = categories );

    this.applicationQuery.shop$.subscribe( shop => {
      this.shop = shop;
      if (this.webSocketService.isConnected()) {
        this.receiverOrdersData();
      }
    } );
  }

  // tslint:disable-next-line: typedef
  price( item: CartItem, kind: string ) {
    // tslint:disable-next-line: typedef
    let topping_price = 0;
    if (kind === "local") {
      if (item.category_id) {
        item.toppings.forEach(element => {
          topping_price += element.price * item.quantity;
        });
      }
      return item.price * item.quantity + topping_price;
    } else {
      if (item.category_id) {
        item.toppings.forEach(element => {
          topping_price += element.price * item.quantity;
        });
      }
      return item.price * item.quantity + topping_price;
    }
  }

  // tslint:disable-next-line: typedef
  receiverOrdersData() {
    this.receiveOrdersObs = this.webSocketService.receiveOrderOnline().subscribe(
      data => {
        if (JSON.parse(data)) {

          console.log("Online order: ", data);
          // tslint:disable-next-line: typedef
          this.onlineCart = [];

          // tslint:disable-next-line: typedef
          const order = JSON.parse(data);

          order.carts.forEach(cart => {
            // tslint:disable-next-line: typedef
            let cart1 = {
              _id: cart.product_id,
              category_id: cart.category_id,
              name: cart.product_name,
              code: cart.product_code ? cart.product_code : "",
              description: cart.product_description,
              price: cart.price,
              quantity: cart.quantity,
              size: "",
              size_idx: 1,
              tax: cart.tax
            };
            // tslint:disable-next-line: typedef
            let toppings = [];
            cart.toppings.forEach(topping_ele => {
              toppings.push(
                {
                  name: topping_ele.name,
                  price:  topping_ele.price,
                  idx: topping_ele._id
                }
              );
              cart1.size = topping_ele.size;
            });
            this.onlineCart.push({
              ...cart1,
              toppings: toppings
            });
          });
        }
      }
    );
  }

}
