import { Injectable } from "@angular/core";
import { webSocket } from "rxjs/webSocket";
import { share } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { io } from "socket.io-client";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class WebSocketService {

  private socket: any;

  isConnected(): boolean {
    return this.socket != null;
  }

  // tslint:disable-next-line: no-empty
  connect(callback: Function = () => {}): void {
      this.socket = io(environment.server, { path: environment.socketPath });

      this.socket.on("error", error => {
          console.log(error);
      });

      this.socket.on("connect", () => {
          callback();
      });
  }

  sendOrderData(shopId: string): void {
    if (this.isConnected()) {
      this.socket.emit("order:print", { shopId });
    }
  }

}
