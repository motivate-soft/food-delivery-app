import { Component, Input, OnInit } from '@angular/core';
import { CartItem, Product, Shop } from '@pages/shop/state/shop.model';
import { ShopQuery } from '@pages/shop/state/shop.query';
import { ShopService } from '@pages/shop/state/shop.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  @Input() shop: Shop;
  selectedDropmenuId: any;
  selectedCategoryId: any;
  selectedToppingDropmenuId: any;


  constructor(
    private shopQuery: ShopQuery,
    private shopService: ShopService
  ) { }

  ngOnInit(): void {
    
  }

  addToCart( product: Product, price: number ) {

    const cartItem: CartItem = {
      product_id: product._id,
      product_name: product.name,
      product_code: product.code,
      product_description: product.description,
      price: price,
      quantity: 1
    }  

    this.shopService.addToCart( cartItem );
    this.selectedDropmenuId = -1;
    this.selectedToppingDropmenuId = -1;
  }

  
  openDropmenu(categoryId, menuId) {
    if (this.selectedCategoryId == categoryId && this.selectedDropmenuId == menuId) {
      this.selectedDropmenuId = -1;
    } else {
      this.selectedDropmenuId = menuId;
      this.selectedCategoryId = categoryId;
    }
  }


  addToppingToCart( topping: {
    name: string;
    prices: number[]
  }, price: number ) {

    this.selectedDropmenuId = -1;
    this.selectedToppingDropmenuId = -1;
  }

  openToppingDropmenu(categoryId, toppingId) {
    if (this.selectedCategoryId == categoryId && this.selectedToppingDropmenuId == toppingId) {
      this.selectedToppingDropmenuId = -1;
    } else {
      this.selectedToppingDropmenuId = toppingId;
      this.selectedCategoryId = categoryId;
    }
  }

}
