import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductItem, Topping, CartItem } from '@pages/shop/state/shop.model';
import { ShopService } from '@pages/shop/state/shop.service';
import { NotificationService } from '@app_/common/notification.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent {

  sizeOrder: number;
  selectedPrice: number;

  toppings: Array<Topping>;
  quantity: number = 1;

  isSubmit: boolean;

  constructor(
    private shopService: ShopService,
    private notifacationService: NotificationService,
    public dialogRef: MatDialogRef<ProductListComponent>,
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
            size: 0
          })
        }
      }
    }
  }

  changeSize() {
    this.selectedPrice = this.data.product.prices[this.sizeOrder];
  }

  changeSizeForTopping(toppingOrder: number) {
    this.toppings[toppingOrder].selectedPrice = this.toppings[toppingOrder].prices[this.toppings[toppingOrder].size];
    this.toppings[toppingOrder].selected = true;
  }

  addToCart() {

    this.isSubmit = true;

    let cartItem: CartItem = {
      shop_id: this.data.shop_id,
      product_id: this.data.product._id,
      product_name: this.data.product.name,
      product_code: this.data.product.code,
      product_description: this.data.product.description,
      price: this.selectedPrice,
      quantity: this.quantity,
      size: this.data.sizes[this.sizeOrder]
    }

    const selectedToppings = [];
    let extraPrice = 0;
    for (let in_t = 0; in_t < this.toppings.length; in_t++) {
      const element = this.toppings[in_t];
      if (element.selected) {
        selectedToppings.push({
          _id: element._id,
          name: element.name,
          size: this.data.sizes[element.size],
          price: element.selectedPrice
        });
        extraPrice = 0 + element.selectedPrice;
      }
    }

    if (selectedToppings.length > 0) {
      cartItem = {
        ...cartItem,
        toppings: selectedToppings,
        price: cartItem.price + extraPrice
      }
    }

    this.shopService.addToCart( cartItem );

    this.notifacationService.showNotification('success', 'Added ' + cartItem.product_name + '(' + cartItem.price + '€) to your busket.');

    this.onClose();

  }

  onClose(): void {
    this.dialogRef.close();
  }


}