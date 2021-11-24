import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopRoutingModule } from './shop-routing.module';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ShopHeaderComponent } from './components/shop-header/shop-header.component';
import { ShopComponent } from './components/shop/shop.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CartComponent } from './components/cart/cart.component';


@NgModule({
  declarations: [ProductListComponent, ShopHeaderComponent, ShopComponent, SidebarComponent, CartComponent],
  imports: [
    CommonModule,
    ShopRoutingModule
  ]
})
export class ShopModule { }
