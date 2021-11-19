
import { Component, OnInit } from "@angular/core";
import { ApplicationQuery } from "../../../../state/application.query";
import { Address, CartItem } from "../../../../services/shop/shop.model";
import { ElectronService } from "../../../../services/electron.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit {

  cart!: CartItem[];
  address!: Address;

  submitted = false;

  constructor(
    private readonly applicationQuery: ApplicationQuery,
    private readonly electronService: ElectronService
  ) { }

  ngOnInit(): void {

    this.applicationQuery.cart$.subscribe( cart => this.cart = cart );
    this.applicationQuery.address$.subscribe( address => this.address = address );

    this.electronService.ipcRenderer.on("order:printed", (event, arg) => {
      this.submitted = false;
    });
  }

  printOrder(): void {
    /**
     * @todo validate cart and address
     */
    this.submitted = true;
    this.electronService.ipcRenderer.send("order:print", { cart: this.cart, address: this.address });
  }

}
