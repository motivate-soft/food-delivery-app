import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";

import { CustomersRoutingModule } from "./customers-routing.module";
import { CustomersListComponent } from "./components/customers-list/customers-list.component";
import { CustomersComponent } from "./customers.component";
import { AddCustomerComponent } from "./components/add-customer/add-customer.component";
import { UpdateCustomerComponent } from "./components/update-customer/update-customer.component";


@NgModule({
  declarations: [
    CustomersListComponent,
    CustomersComponent,
    AddCustomerComponent,
    UpdateCustomerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CustomersRoutingModule,
  ]
})
export class CustomersModule { }
