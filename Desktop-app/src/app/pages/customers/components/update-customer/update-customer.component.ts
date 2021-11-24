import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Customer } from "../../../../services/shop/shop.model";
import { ApplicationQuery } from "../../../../state/application.query";
import { ElectronService } from "../../../../core/services/electron/electron.service";
import { ApplicationService } from "../../../../state/application.service";

@Component({
  selector: "app-update-customer",
  templateUrl: "./update-customer.component.html",
  styleUrls: ["./update-customer.component.scss"]
})
export class UpdateCustomerComponent implements OnInit {

  customerId: number;
  customer: Customer;
  form: FormGroup;
  submitted = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly applicationQuery: ApplicationQuery,
    private readonly electronService: ElectronService,
    private readonly applicationService: ApplicationService,
  ) {
    //
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      name: ["", Validators.required ],
      street: ["", Validators.required ],
      city: ["", Validators.required ],
      postal_code: ["", Validators.required ],
      telephone: ["", Validators.required],
    });


    this.route.paramMap.subscribe( params => {
      this.customerId = + params.get("id");

      this.applicationQuery.customerById$( this.customerId ).subscribe( customer => {
        this.customer = customer;
        this.form.patchValue( this.customer );
      });

    });


  }

  // tslint:disable-next-line: typedef
  save() {
    this.submitted = true;

    if (this.form.invalid) {
      return null;
    }

    // tslint:disable-next-line: typedef
    const fields = this.changedControls();

    if( Object.keys( fields ).length > 0 ) {
      this.electronService.ipcRenderer.send("customer:update", fields );

      setTimeout(() => {
        this.router.navigateByUrl("/customers");
      }, 1000);
    }
  }

  // tslint:disable-next-line: typedef
  changedControls() {
    // tslint:disable-next-line: typedef
    const dirty = {};
    // tslint:disable-next-line: typedef
    const controls = this.form.controls;
    for (const name in controls) {
        if (controls[name].dirty) {
          dirty[ name] = controls[name].value;
        }
    }
    // tslint:disable-next-line: no-string-literal
    dirty["id"] = this.customerId;
    return dirty;
  }


  // tslint:disable-next-line: typedef
  get name() { return this.form.get("name"); }
  // tslint:disable-next-line: typedef
  get street() { return this.form.get("street"); }
  // tslint:disable-next-line: typedef
  get city() { return this.form.get("city"); }
  // tslint:disable-next-line: typedef
  get postal_code() { return this.form.get("postal_code"); }
  // tslint:disable-next-line: typedef
  get telephone() { return this.form.get("telephone"); }

}
