import { Component, Input, OnInit } from '@angular/core';
import { Shop } from '@pages/shop/state/shop.model';

@Component({
  selector: 'app-shop-header',
  templateUrl: './shop-header.component.html',
  styleUrls: ['./shop-header.component.scss']
})
export class ShopHeaderComponent implements OnInit {

  @Input() shop: Shop;
  constructor() { }

  ngOnInit(): void {
    
  }

}
