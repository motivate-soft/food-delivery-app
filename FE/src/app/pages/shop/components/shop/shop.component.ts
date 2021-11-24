import { Component, OnInit } from '@angular/core';
import { ShopService } from '@pages/shop/state/shop.service';
import { ShopQuery } from '@pages/shop/state/shop.query';
import { Shop } from '@pages/shop/state/shop.model';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  shop: Shop;

  constructor(
    private shopService: ShopService,
    public shopQuery: ShopQuery
  ) { }

  ngOnInit(): void {
    this.shopQuery.shop$.subscribe( shop => this.shop = shop );

    // Request shop information
    this.shopService.setLoading( true );  
    this.shopService.getShop();
  }

}
