import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShopService } from '@pages/shop/state/shop.service';
import { NotificationService } from '@app_/common/notification.service';
import { Address } from '@pages/shop/state/shop.model';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-address-dialog',
  templateUrl: './address-dialog.component.html',
  styleUrls: ['./address-dialog.component.scss']
})
export class AddressDialogComponent implements OnInit {

  addressForm: FormGroup;
  matcher = new ErrorStateMatcher();

  constructor(
    private shopService: ShopService,
    private notifacationService: NotificationService,
    public dialogRef: MatDialogRef<AddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Address,
  ) {}

  ngOnInit(): void {

    this.addressForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
      telephone: new FormControl(''),
   });
  }

  onFormSubmit() {
    if (this.addressForm.valid) {
      console.log(this.addressForm.value);
      this.dialogRef.close(this.addressForm.value);
    } else {
      return;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
