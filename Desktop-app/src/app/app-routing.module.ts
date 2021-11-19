import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', pathMatch: 'full', loadChildren: () => import('./pages/home/home.module').then( m => m.HomeModule )},
  {path: 'customers', loadChildren: () => import('./pages/customers/customers.module').then( m => m.CustomersModule )},
  {path: 'drivers', pathMatch: 'full', loadChildren: () => import('./pages/drivers/drivers.module').then( m => m.DriversModule )},
  {path: 'orders', pathMatch: 'full', loadChildren: () => import('./pages/orders/orders.module').then( m => m.OrdersModule )},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
