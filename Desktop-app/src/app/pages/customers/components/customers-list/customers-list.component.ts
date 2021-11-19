import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Customer } from "../../../../services/shop/shop.model";
import { ApplicationQuery } from "../../../../state/application.query";
import { ElectronService } from "../../../../core/services/electron/electron.service";

@Component({
  selector: "app-customers-list",
  templateUrl: "./customers-list.component.html",
  styleUrls: ["./customers-list.component.scss"]
})
export class CustomersListComponent implements OnInit, OnDestroy {

  customers: Customer[];
  subscription: Subscription;
  constructor(
    private readonly applicationQuery: ApplicationQuery,
    private readonly electronService: ElectronService,
  ) { }

  ngOnInit(): void {
    this.customers = [];

    this.subscription = this.applicationQuery.customers$.subscribe( customers => {
      this.customers = customers;
    });
  }

  // tslint:disable-next-line: typedef
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // tslint:disable-next-line: typedef
  delete(customerId): void {
    this.electronService.ipcRenderer.send("customer:delete", customerId );
  }

}
