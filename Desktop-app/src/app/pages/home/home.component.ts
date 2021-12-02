import { Component, OnInit } from "@angular/core";
import { ElectronService } from "../../core/services";
import { ShopService } from "../../services/shop/shop.service";
import { Shop, Product, Category, CartItem } from "../../services/shop/shop.model";
import { ApplicationQuery } from "../../state/application.query";
import { ApplicationService } from "../../state/application.service";
import { WebSocketService } from "../../services/web-socket.service";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

  shop: Shop;

  products: Product[] = [];
  filtered: Product[] = [];
  // selectedIdx = 0;

  categories:{ [key: string]: Category } = {};
  category: Category;

  constructor(
    private readonly shopService: ShopService,
    private readonly applicationQuery: ApplicationQuery,
    private readonly applicationService: ApplicationService,
    private readonly electronService: ElectronService,
    private webSocketService: WebSocketService
  ) {

  }

  // tslint:disable-next-line: typedef
  ngOnInit() {

    this.shopService.get().subscribe( response => {
      this.shop = response.data;

      this.shop.categories.forEach( category => {

        // tslint:disable-next-line: typedef
        const products = category.products.map( product => {
          // tslint:disable-next-line: no-string-literal
          product["category_id"] = category._id;
          return product;
        });

        this.products.push( ...products );
        this.categories[ category._id ] = category;
      });

      this.applicationService.setShop( this.shop );
      this.applicationService.setProducts( this.products );
      this.applicationService.setCategories( this.categories );

      this.webSocketService.sendMessage({ type: "infirm_order", shop_id: this.shop._id, owner: this.shop.owner || "" });
      setInterval(() => {
        this.webSocketService.sendMessage({ type: "infirm_order", shop_id: this.shop._id, owner: this.shop.owner || "" });
      }, 10000);

      if ( this.electronService.isElectron) {
        // console.log(process.env);
        console.log("Run in electron");
        // console.log("Electron ipcRenderer", this.electronService.ipcRenderer);
        // console.log("NodeJS childProcess", this.electronService.childProcess);
      } else {
        console.log("Run in browser");
      }

    }, err => {
      this.electronService.ipcRenderer.send("notification:empty", { message1: "Server disconnected", message2: "Please check the server" });
    });
  }

}