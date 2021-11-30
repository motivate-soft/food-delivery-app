
import { Component, OnInit } from "@angular/core";
import { ApplicationQuery } from "../../../../state/application.query";
import { Address, CartItem } from "../../../../services/shop/shop.model";
import { ElectronService } from "../../../../services/electron.service";
import { WebSocketService } from "../../../../services/web-socket.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit {

  cart!: CartItem[];
  address!: Address;

  submitted = false;

  remoteOrderID: string;
  remoteShopID: string;

  constructor(
    private readonly applicationQuery: ApplicationQuery,
    private readonly electronService: ElectronService,
    private webSocketService: WebSocketService
  ) { }

  ngOnInit(): void {

    this.applicationQuery.cart$.subscribe( cart => this.cart = cart );
    this.applicationQuery.address$.subscribe( address => this.address = address );

    this.electronService.ipcRenderer.on("order:printed", (event, arg) => {
      this.submitted = false;
    });

    this.webSocketService.messages$.subscribe(
      msg => {
        // tslint:disable-next-line: typedef

        if (JSON.parse(msg)) {
          let remoteCart = [];

          // tslint:disable-next-line: typedef
          const order = JSON.parse(msg);
          this.remoteShopID = order.shop_id;
          this.remoteOrderID = order._id;
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

          console.log(remoteCart)

          this.submitted = true;
          this.electronService.ipcRenderer.send("order:print", { cart: remoteCart, address: {
            name: "test name",
            street: "test street",
            city: "test city",
            telephone: 12312312,
            remarks: "5"
          } });

          // tslint:disable-next-line: max-line-length
          this.webSocketService.sendMessage({ type: "confirm_order", order_id: this.remoteOrderID, shop_id: this.remoteShopID });
        }
      },
      error => { console.log("Error on socket connection:", error); },
      () => { console.log("Socket closed"); }
    );
  }

  printOrder(): void {
    /**
     * @todo validate cart and address
     */
    this.submitted = true;
    this.electronService.ipcRenderer.send("order:print", { cart: this.cart, address: this.address });
  }

}
