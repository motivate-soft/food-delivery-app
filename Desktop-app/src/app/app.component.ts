import { Component, OnInit  } from "@angular/core";
import { ElectronService } from "./core/services/electron/electron.service";
import { ApplicationService } from "./state/application.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  constructor(
    private readonly electronService: ElectronService,
    private readonly applicationService: ApplicationService,
   ) {}


  // tslint:disable-next-line: typedef
  ngOnInit() {
    // request Application Data
    this.electronService.ipcRenderer.send("customer:findAll");
    this.electronService.ipcRenderer.send("order:findAll");
    this.electronService.ipcRenderer.send("driver:findAll");
    this.electronService.ipcRenderer.send("settings:findAll");

    // observe Event Emitters
    this.electronService.ipcRenderer.on("customer:findAll:response", (event, customers) => {
      this.applicationService.setCustomers( customers );
    });
    this.electronService.ipcRenderer.on("customer:create:response", (event, customer) => {
      this.applicationService.insertCustomer( customer );
    });

    this.electronService.ipcRenderer.on("order:findAll:response", (event, orders) => {
      this.applicationService.setOrders( orders );
    });

    this.electronService.ipcRenderer.on("driver:findAll:response", (event, drivers) => {
      this.applicationService.setDrivers( drivers );
    });

    this.electronService.ipcRenderer.on("settings:findAll:response", (event, settings) => {
      this.applicationService.setSettings( settings );
    });
  }

}
