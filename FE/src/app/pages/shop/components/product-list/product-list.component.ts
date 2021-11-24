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
  }

}
