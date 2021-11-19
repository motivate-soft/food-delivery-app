import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersListComponent } from './components/customers-list/customers-list.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { UpdateCustomerComponent } from './components/update-customer/update-customer.component';
import { CustomersComponent } from  './customers.component';


const routes: Routes = [
  {
    path: '',
    component: CustomersComponent,
    children: [
      {
        path: 'add',
        component: AddCustomerComponent
      },
      {
        path: 'update/:id',
        component: UpdateCustomerComponent
      },
      {
        path: 'list',
        component: CustomersListComponent
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class CustomersRoutingModule { }
