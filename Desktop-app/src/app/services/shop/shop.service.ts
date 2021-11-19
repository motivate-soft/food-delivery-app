import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { Shop } from './shop.model';


@Injectable({
  providedIn: 'root'
})
export class ShopService {
  constructor(private readonly http: HttpClient) {}

  get() {
    return this.http.get<Shop>(`${environment.server}/assets/data/shop.json`).pipe(tap( (response: any ) => {
      const shop = response.data.findShopById;
      const entity = {
        [shop._id]: shop
      }
    }));
  }

}
