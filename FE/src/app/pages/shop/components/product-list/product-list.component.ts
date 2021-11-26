import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CartItem, Product, Shop, Category, ProductItem } from '@pages/shop/state/shop.model';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  shop: Shop;
  categories: Array<Category>;

  products: Array<ProductItem>

  cart:Array<CartItem>;

  selectedCategory = 'all'

  @Input()
  set data(shop: Shop) {
    this.shop = shop;
    this.categories = [];
    this.products = [];
    this.categories.push(...this.shop.categories);
    for (let index = 0; index < this.categories.length; index++) {
      const category = this.categories[index];
      category.products.forEach(element => {
        this.products.push({
          shop_id: this.shop._id,
          category_id: category._id,
          category_name: category.name,
          sizes: category.sizes,
          product: element,
          toppings: category.toppings ? category.toppings : [],
          tax: category.tax? category.tax : 0
        })
      });
    }
  }

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {}

  onClickCategoryList(categoryId: string) {
    this.selectedCategory = categoryId;

    this.categories = [];

    if (categoryId === 'all') {
      this.categories.push(...this.shop.categories);
    }
    else {
      for (let index = 0; index < this.shop.categories.length; index++) {
      
        if (this.shop.categories[index]._id === categoryId) {
          this.categories.push(this.shop.categories[index]);
          break;
        }
      }
    }

    this.products = [];
    for (let index = 0; index < this.categories.length; index++) {
      const category = this.categories[index];
      category.products.forEach(element => {
        this.products.push({
          shop_id: this.shop._id,
          category_id: category._id,
          category_name: category.name,
          sizes: category.sizes,
          product: element,
          toppings: category.toppings ? category.toppings : [],
          tax: category.tax? category.tax : 0
        })
      });
    }
  }

  openDialog(product: ProductItem): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      // width: '450px',
      maxWidth: '1000px',
      data: product,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
