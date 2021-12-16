import { Component, OnInit, OnDestroy } from "@angular/core";
import { CartItem, Category, Shop, Address } from "../../../../services/shop/shop.model";
import { ApplicationQuery } from "../../../../state/application.query";
import { ApplicationService } from "../../../../state/application.service";
import { WebSocketService } from "../../../../services/web-socket.service";
import { ElectronService } from "../../../../services/electron.service";

@Component({
  selector: "app-orders-list",
  templateUrl: "./orders-list.component.html",
  styleUrls: ["./orders-list.component.scss"]
})
export class OrdersListComponent implements OnInit, OnDestroy {

  cart: CartItem[] = [];
  onlineCart: {
    address: Address,
    carts: CartItem[],
    request_date: string,
    place: string
  }[] = [];

  categories: { [ key: string]: Category } = {};
  selectedItem = 0;

  shop!: Shop;
  receiveOrdersObs: any;
  receivePrintObs: any;
  remoteShopID: any;
  remoteOrderID: any;
  submitted: boolean;

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
    private electronService: ElectronService,
    private webSocketService: WebSocketService
  ) { }

  ngOnDestroy(): void {
    if (this.receiveOrdersObs !== undefined) {
      this.receiveOrdersObs.unsubscribe();
    }
    if (this.receivePrintObs !== undefined) {
      this.receivePrintObs.unsubscribe();
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

  price( item: CartItem ): number {
    // tslint:disable-next-line: typedef
    let topping_price = 0;
    if (item.category_id) {
      item.toppings.forEach(element => {
        topping_price += element.price * item.quantity;
      });
    }
    return item.price * item.quantity + topping_price;
  }

  accumPrice(carts: CartItem[]): number {
    return carts.reduce( (acc, item) => {
      acc += item.price * item.quantity;
      // tslint:disable-next-line: typedef
      let toppingPrice = 0;
      item.toppings.forEach(element => {
        toppingPrice += element.price * item.quantity;
      });
      return acc + toppingPrice;
    }, 0 );
  }

  printOrder(content: {
    address: Address,
    carts: CartItem[],
    request_date: string,
    place: string
  }): void {
    /**
     * @todo validate cart and address
     */
    // this.electronService.ipcRenderer.send("order:print", { cart: this.cart, address: this.address });
    this.electronService.ipcRenderer.send("order:print", {
      shop: {
        name: this.shop.name ? this.shop.name : "",
        city: this.shop.city ? this.shop.city : "",
        street: this.shop.street ? this.shop.street : "",
        postal_code: this.shop.postal_code ? this.shop.postal_code : ""
      },
      cart: content.carts,
      address: content.address,
      request_date: content.request_date
     });
  }

  // tslint:disable-next-line: typedef
  receiverOrdersData() {
    this.receiveOrdersObs = this.webSocketService.receiveOrderOnline().subscribe(
      res => {
        if (JSON.parse(res)) {

          // tslint:disable-next-line: typedef
          this.onlineCart = [];

          JSON.parse(res).forEach(data => {

            // tslint:disable-next-line: typedef
            const order = data;

            let carts: CartItem[] = [];

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
              carts.push({
                ...cart1,
                toppings: toppings
              });
            });

            this.onlineCart.push({
              address: order.address,
              carts: carts,
              request_date: order.request_date, // new Intl.DateTimeFormat("de-DE").format(new Date(order.request_date)),
              place: data.place ? data.place : "online"
            });
          });
        }
      }
    );
  }

}
