import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";

import { OrdersRoutingModule } from "./orders-routing.module";
import { OrdersComponent } from "./orders.component";
import { OrdersListComponent } from "./components/orders-list/orders-list.component";


@NgModule({
  declarations: [OrdersComponent, OrdersListComponent],
  imports: [
    SharedModule,
    OrdersRoutingModule
  ]
})
export class OrdersModule { }
