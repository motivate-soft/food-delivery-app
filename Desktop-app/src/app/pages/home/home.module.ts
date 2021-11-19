import { NgModule } from '@angular/core';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SharedModule } from '../../shared/shared.module'
import { HomeRoutingModule } from './home-routing.module';

import { ProductsComponent } from './components/products/products.component';
import { IngredientsComponent } from './components/ingredients/ingredients.component';
import { OrderComponent } from './components/order/order.component';
import { AddressComponent } from './components/address/address.component';
import { HomeComponent } from './home.component';
import { FooterComponent } from './components/footer/footer.component';

console.log( AddressComponent )
@NgModule({
  declarations: [
    ProductsComponent,
    IngredientsComponent,
    OrderComponent,
    AddressComponent,
    HomeComponent,
    FooterComponent,
  ],
  imports: [
    SharedModule,
    HomeRoutingModule,
    AutocompleteLibModule
  ]
})
export class HomeModule { }
