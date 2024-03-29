import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApplicationService } from "../../../../state/application.service";
import { ElectronService } from "../../../../core/services";
import { Customer } from "../../../../services/shop/shop.model";
import { ApplicationQuery } from "../../../../state/application.query";
import { Subscription } from "rxjs";

@Component({
  selector: "app-address",
  templateUrl: "./address.component.html",
  styleUrls: ["./address.component.scss"]
})
export class AddressComponent implements OnInit {


  @ViewChild("choices") choices: ElementRef<any>;

  form: FormGroup;

  customerArr: Customer[] = [];
  dataForName = [];
  dataForStreet = [];
  subscription: Subscription;

  customers = [];
  filtered = [];
  selectedIdx = 0;

  KEY: any = {
    KEY_TAB: 13,
    KEY_RETURN: 13,
    KEY_ESC: 27,
    KEY_LEFT: 37,
    KEY_RIGHT: 39,
    KEY_UP: 38,
    KEY_DOWN: 40
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly applicationService: ApplicationService,
    private readonly electronService: ElectronService,
    private readonly applicationQuery: ApplicationQuery
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      name: ["", Validators.required ],
      street: ["", Validators.required ],
      city: ["", Validators.required ],
      telephone: [""],
      remarks: [""]
    });

    this.subscription = this.applicationQuery.customers$.subscribe( customers => {
      this.customers = customers;

      this.dataForName = this.customers.map((item) => item.name);
      this.dataForStreet = this.customers.map((item) => item.street);
    });
  }

  // tslint:disable-next-line: typedef
  selectEvent(item) {
    // tslint:disable-next-line: typedef
    const customer = this.customers.find(element => element.name === item || element.street === item);
    if (customer) {
      // tslint:disable-next-line: no-string-literal
      this.form.controls["name"].setValue(customer.name);
      // tslint:disable-next-line: no-string-literal
      this.form.controls["street"].setValue(customer.street);
      // tslint:disable-next-line: no-string-literal
      this.form.controls["city"].setValue(customer.city);
      // tslint:disable-next-line: no-string-literal
      this.form.controls["telephone"].setValue(customer.telephone);
    }
  }

  // tslint:disable-next-line: typedef
  updateAddress() {
    this.applicationService.updateAddress( this.form.value );
  }

  // tslint:disable-next-line: typedef
  filterCustomers(event) {

    this.choices?.nativeElement.classList.remove("hidden");

    switch(event.keyCode) {
      case this.KEY.KEY_TAB:
      case this.KEY.KEY_RETURN:
        this.updateCustomer( this.filtered[this.selectedIdx ]);
        return;
      case this.KEY.KEY_ESC:
        this.hide();
        return;
      case this.KEY.KEY_LEFT:
      case this.KEY.KEY_RIGHT:
        return;
      case this.KEY.KEY_UP:
        this.markPrevious();
        return;
      case this.KEY.KEY_DOWN:
        this.markNext();
        return;
     }

    const input: string = this.name.value.toLocaleLowerCase()
    this.filtered = this.customers.filter( customer => customer.name.toLocaleLowerCase().includes(input));

  }

  // tslint:disable-next-line: typedef
  updateCustomer(customer) {
    this.form.patchValue(customer);
    this.choices.nativeElement.classList.add("hidden");
    // this.updateAddress()
  }

  // tslint:disable-next-line: typedef
  hide() {
    this.choices?.nativeElement.classList.add("hidden");
  }

  // tslint:disable-next-line: typedef
  markPrevious() {
    this.selectedIdx = this.selectedIdx === 0 ? 0 : this.selectedIdx - 1;
  }

  // tslint:disable-next-line: typedef
  markNext() {
    this.selectedIdx = this.selectedIdx < this.filtered.length - 1 ? this.selectedIdx + 1 : this.selectedIdx;
  }

  // tslint:disable-next-line: typedef
  get name() { return this.form.get("name"); }

}
