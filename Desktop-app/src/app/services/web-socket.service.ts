import { Injectable } from "@angular/core";
import { webSocket } from "rxjs/webSocket";
import { share } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class WebSocketService {

  private readonly socket$ = webSocket( { url: environment.socket, deserializer: e => e.data });

  public messages$ = this.socket$.asObservable();

  // tslint:disable-next-line: typedef
  public sendMessage(msg: any) {
    this.socket$.next(msg);
  }

  // tslint:disable-next-line: typedef
  public closeConnection() {
    this.socket$.complete();
  }
}
