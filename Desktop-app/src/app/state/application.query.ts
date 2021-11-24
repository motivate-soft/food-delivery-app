import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { ApplicationStore, ApplicationState } from "./application.store";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class ApplicationQuery extends QueryEntity<ApplicationState> {

  constructor(protected store: ApplicationStore) {
    super(store);
  }

  address$ = this.select("address");
  category$ = this.select("category");
  filter$ = this.select("filter");
  products$ = this.select("products");
  categories$ = this.select("categories");
  cart$ = this.select("cart");
  selected_cart_item$ = this.select("selected_cart_item");
  customers$ = this.select( state => state.customers );
  drivers$ = this.select("drivers");
  orders$ = this.select("orders");
  settings$ = this.select("settings");

  // tslint:disable-next-line: typedef
  customerById$(customerId: number ){
    return this.customers$.pipe(
      map((customers) => {
        return customers.find(x => x.id === customerId);
      })
    );
  }

}
