import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { tap } from "rxjs/operators";
import { Shop, Address, CartItem } from "./shop.model";
import { WebSocketService } from "../web-socket.service";
import { ElectronService } from "../../core/services";


@Injectable({
  providedIn: "root"
})
export class ShopService {
  constructor(
    private readonly http: HttpClient,
    private webSocketService: WebSocketService,
    private electronService: ElectronService) {}

  // tslint:disable-next-line: typedef
  get() {
    return this.http.get<Shop>(`${environment.server}/api/shop/getShop`).pipe(tap( (response: any ) => {
      // tslint:disable-next-line: typedef
      const shop = response.data;
      // tslint:disable-next-line: typedef
      const entity = {
        [shop._id]: shop
      };
    }));
  }

  postConfirmCart(cart: {
    address: Address
    shop_id: string,
    carts: Array<CartItem>,
    place: string
  }): any {
    return this.http.post(`${environment.server}/api/shop/confirmCart`, cart).pipe(tap( (response: any ) => {
      if (!response.error) {

        if (this.webSocketService.isConnected()) {
          this.webSocketService.sendOrderData(cart.shop_id);
        } else {
          this.webSocketService.connect(cart.shop_id, () => {
            this.webSocketService.sendOrderData(cart.shop_id);
          });
        }

      } else {
        this.electronService.ipcRenderer.send("notification:empty", { message1: "To save order failed.", message2: response.message });
      }
    })).subscribe();
  }

}
