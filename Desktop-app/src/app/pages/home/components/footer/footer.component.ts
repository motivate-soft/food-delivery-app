
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ApplicationQuery } from "../../../../state/application.query";
import { Address, CartItem, Shop } from "../../../../services/shop/shop.model";
import { ElectronService } from "../../../../services/electron.service";
import { WebSocketService } from "../../../../services/web-socket.service";
import { ApplicationService } from "../../../../state/application.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit, OnDestroy {

  cart!: CartItem[];
  address!: Address;
  shop!: Shop;

  submitted = false;

  remoteOrderID: string;
  remoteShopID: string;

  receiveOrdersObs: any;

  constructor(
    private readonly applicationQuery: ApplicationQuery,
    private readonly electronService: ElectronService,
    private readonly applicationService: ApplicationService,
    private webSocketService: WebSocketService
  ) { }

  ngOnDestroy(): void {
    if (this.receiveOrdersObs !== undefined) {
      this.receiveOrdersObs.unsubscribe();
    }
  }

  ngOnInit(): void {

    this.applicationQuery.cart$.subscribe( cart => this.cart = cart );
    this.applicationQuery.address$.subscribe( address => this.address = address );
    this.applicationQuery.shop$.subscribe( shop => {
      this.shop = shop;
      if (this.webSocketService.isConnected()) {
        this.receiverOrdersData();
      }
    } );

    this.electronService.ipcRenderer.on("order:printed", (event, arg) => {
      this.submitted = false;
    });
  }

  printOrder(): void {
    /**
     * @todo validate cart and address
     */
    this.submitted = true;
    // this.electronService.ipcRenderer.send("order:print", { cart: this.cart, address: this.address });
    this.electronService.ipcRenderer.send("order:print", {
      shop: {
        name: this.shop.name ? this.shop.name : "",
        city: this.shop.city ? this.shop.city : "",
        street: this.shop.street ? this.shop.street : "",
        postal_code: this.shop.postal_code ? this.shop.postal_code : ""
      },
      cart: this.cart,
      address: {
        name: "test name",
        street: "test street",
        city: "test city",
        telephone: 12312312,
        remarks: "5"
      },
      request_date: new Date()
     });
  }

    // tslint:disable-next-line: typedef
    receiverOrdersData() {
      this.receiveOrdersObs = this.webSocketService.receiveOrderData().subscribe(
        data => {
          if (JSON.parse(data)) {
            // tslint:disable-next-line: typedef
            let remoteCart = [];

            // tslint:disable-next-line: typedef
            const order = JSON.parse(data);
            this.remoteShopID = order.shop_id;
            this.remoteOrderID = order._id;

            this.applicationService.updateAddress( order.address );

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
              remoteCart.push({
                ...cart1,
                toppings: toppings
              });
            });

            this.submitted = true;
            this.electronService.ipcRenderer.send("order:print", {
            shop: {
              name: this.shop.name ? this.shop.name : "",
              city: this.shop.city ? this.shop.city : "",
              street: this.shop.street ? this.shop.street : "",
              postal_code: this.shop.postal_code ? this.shop.postal_code : ""
            },
            cart: remoteCart,
            address: order.address,
            request_date: order.request_date
           });

            // tslint:disable-next-line: max-line-length
            this.webSocketService.printedReport(this.remoteOrderID);
          }
        }
      );
    }

}
