import { Component, OnInit } from "@angular/core";
import { Router, Route } from "@angular/router";
import { Shop } from "../../services/shop/shop.model";
import { WebSocketService } from "../../services/web-socket.service";
import { ApplicationQuery } from "../../state/application.query";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"]
})
export class OrdersComponent implements OnInit {

  shop!: Shop;
  constructor(
    private router: Router,
    private applicationQuery: ApplicationQuery,
    private webSocketService: WebSocketService ) {
    this.printpath("", this.router.config);
  }

  // tslint:disable-next-line: no-empty
  ngOnInit(): void {
    this.applicationQuery.shop$.subscribe( shop => {
      this.shop = shop;
      if (this.shop._id) {
        this.webSocketService.sendOrderTotal(this.shop._id);
      }
    } );
  }

  // tslint:disable-next-line: typedef
  printpath(parent: String, config: Route[]) {
    // tslint:disable-next-line: typedef
    for (let i = 0; i < config.length; i++) {
      // tslint:disable-next-line: typedef
      const route = config[i];
      if (route.children) {
        // tslint:disable-next-line: typedef
        const currentPath = route.path ? parent + "/" + route.path : parent;
        this.printpath(currentPath, route.children);
      }
    }
  }

  // tslint:disable-next-line: typedef
  home() {
    this.router.navigateByUrl("/");
  }

}
