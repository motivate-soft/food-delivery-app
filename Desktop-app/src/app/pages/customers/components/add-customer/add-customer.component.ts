import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ElectronService } from "../../../../core/services/electron/electron.service";
import { Customer } from "../../../../services/shop/shop.model";

@Component({
  selector: "app-add-customer",
  templateUrl: "./add-customer.component.html",
  styleUrls: ["./add-customer.component.scss"]
})
export class AddCustomerComponent implements OnInit {

  customers: Customer[];
  form: FormGroup;
  submitted = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly electronService: ElectronService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ["", Validators.required ],
      street: ["", Validators.required ],
      city: ["", Validators.required ],
      postal_code: ["", Validators.required ],
      telephone: ["", Validators.required],
    });
  }

  // tslint:disable-next-line: typedef
  save() {
    this.submitted = true;

    if (this.form && this.form.invalid) {
      return null;
    }

    // tslint:disable-next-line: typedef
    const customer = this.form.value;
    this.electronService.ipcRenderer.send("customer:create", customer );

    setTimeout(() => {
      this.router.navigateByUrl("/customers", { replaceUrl: false });
    }, 1000);
  }

  // tslint:disable-next-line: typedef
  invalidControls() {
    // tslint:disable-next-line: typedef
    let invalid = [];
    // tslint:disable-next-line: typedef
    const controls = this.form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
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
