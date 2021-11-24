import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { tap } from "rxjs/operators";
import { Shop } from "./shop.model";


@Injectable({
  providedIn: "root"
})
export class ShopService {
  constructor(private readonly http: HttpClient) {}

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

}
