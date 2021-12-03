import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProductItem, Topping, CartItem, Address } from '@pages/shop/state/shop.model';
import { ShopService } from '@pages/shop/state/shop.service';
import { NotificationService } from '@app_/common/notification.service';
import { AddressDialogComponent } from '../address-dialog/address-dialog.component';
import { ShopQuery } from '@pages/shop/state/shop.query';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent implements OnInit {

  sizeOrder: number;
  selectedPrice: number;

  toppings: Array<Topping>;
  quantity: number = 1;

  isSubmit: boolean;
  userAddress: Address;

  constructor(
    private shopQuery: ShopQuery,
    private shopService: ShopService,
    private notifacationService: NotificationService,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ProductItem,
  ) {
    this.isSubmit = false;
    if (data) {
      this.selectedPrice = this.data.product.prices[0];
      this.toppings = [];
      if (this.data.toppings) {
        for (let inx = 0; inx < this.data.toppings.length; inx++) {
          this.toppings.push({
            ...this.data.toppings[inx],
            selected: false,
            selectedPrice: this.data.toppings[inx].prices[0],
          })
        }
      }
    }
  }

  ngOnInit(): void {
    this.shopQuery.address$.subscribe( address => this.userAddress = address );
  }

  changeSize() {
    this.selectedPrice = this.data.product.prices[this.sizeOrder];
    const tmpToppings = [
      ...this.toppings
    ];
    this.toppings = [];
    if (this.data.toppings) {
      for (let inx = 0; inx < tmpToppings.length; inx++) {
        this.toppings.push({
          ...tmpToppings[inx],
          selectedPrice: tmpToppings[inx].prices[this.sizeOrder],
        })

        if (tmpToppings[inx].selected) {
          this.selectedPrice = this.selectedPrice + tmpToppings[inx].prices[this.sizeOrder]
        }
      }
    }
  }

  changeTopping() {
    this.selectedPrice = this.data.product.prices[this.sizeOrder];
    for (let inx = 0; inx < this.toppings.length; inx++) {
      if (this.toppings[inx].selected) {
        this.selectedPrice = this.selectedPrice + this.toppings[inx].prices[this.sizeOrder]
      }
    }
  }

  addToCart() {

    if (this.userAddress) {
      this.onSubmitOrder();
    } else {
      const dialogRef = this.dialog.open(AddressDialogComponent, {
        maxWidth: '550px',
        data: {data: this.userAddress },
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.shopService.addAddress(result);
          this.onSubmitOrder();
        }
      });
    }

    this.onClose();

  }

  onSubmitOrder() {
    this.isSubmit = true;

    let cartItem: CartItem = {
      shop_id: this.data.shop_id,
      category_id: this.data.category_id,
      product_id: this.data.product._id,
      product_name: this.data.product.name,
      product_code: this.data.product.code,
      product_description: this.data.product.description,
      price: this.selectedPrice,
      quantity: this.quantity,
      tax: this.data.tax ? this.data.tax : 19,
      size: this.sizeOrder ? this.data.sizes[this.sizeOrder] : this.data.sizes[0]
    }

    const selectedToppings = [];
    for (let in_t = 0; in_t < this.toppings.length; in_t++) {
      const element = this.toppings[in_t];
      if (element.selected) {
        selectedToppings.push({
          _id: element._id,
          name: element.name,
          size: this.sizeOrder ? this.data.sizes[this.sizeOrder]: this.data.sizes[0],
          price: element.selectedPrice
        });
      }
    }

    if (selectedToppings.length > 0) {
      cartItem = {
        ...cartItem,
        toppings: selectedToppings
      }
    }

    this.shopService.addToCart( cartItem );

    this.notifacationService.showNotification('success', 'Added ' + cartItem.product_name + '(' + cartItem.price + '€) to your busket.'); 
  }

  onClose(): void {
    this.dialogRef.close();
  }


}
