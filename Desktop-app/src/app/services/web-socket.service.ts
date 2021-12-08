import { Injectable } from "@angular/core";
import { webSocket } from "rxjs/webSocket";
import { share } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { io } from "socket.io-client";
import { Observable } from "rxjs";
import { ApplicationQuery } from "../state/application.query";
import { Shop } from "./shop/shop.model";

@Injectable({
  providedIn: "root"
})
export class WebSocketService {

  private socket: any;
  shop!: Shop;

  constructor(private applicationQuery: ApplicationQuery) {
    this.applicationQuery.shop$.subscribe( shop => {
      this.shop = shop;
    } );
  }

  isConnected(): boolean {
    return this.socket != null;
  }

  // tslint:disable-next-line: no-empty
  connect(shopId: string, callback: Function = () => {}): void {
      this.socket = io(environment.server, { path: environment.socketPath });

      this.socket.on("error", error => {
          console.log(error);
      });

      this.socket.on("connect", () => {
          this.sendShop(shopId);
          callback();
      });
  }

  sendShop(shopId: any): void {
    if (this.isConnected()) {
      this.socket.emit("order:shopId", { shopId });
    }
  }
  receiveActive(): any {
    return new Observable(observer => {
        this.socket.on("order:active", (data: any) => {
            observer.next(data);
        });
    });
  }

  sendOrderData(shopId: string): void {
    if (this.isConnected()) {
      this.socket.emit("order:print", { shopId });
    }
  }
  receiveOrderData(): any {
    return new Observable(observer => {
        this.socket.on("order:data", (data: any) => {
            observer.next(data);
        });
    });
  }

  printedReport(orderId: any): void {
    if (this.isConnected()) {
      this.socket.emit("order:printed", { orderId });
    }
  }

  disconnected(shopId: any): void {
    if (this.isConnected()) {
      this.socket.disconnect();
      this.socket.emit("disconnect", { shopId });
    }
  }
}
