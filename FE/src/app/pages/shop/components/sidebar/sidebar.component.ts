import { ViewportScroller } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Shop } from '@pages/shop/state/shop.model';
import { ShopService } from '@pages/shop/state/shop.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() shop: Shop;
  activeIndex = 0;

  constructor(
    private viewportScroller: ViewportScroller,
    private shopService: ShopService
  ) { }

  ngOnInit(): void {
    this.viewportScroller.setOffset([0, 160]);
  }

  scrollToCategory( idx: number) {
    this.activeIndex = idx;
    this.shopService.updateSelectedCategoryIndex( idx );
    const anchor = `category-${idx}`;
    
    this.viewportScroller.scrollToAnchor( anchor );
  }

}
