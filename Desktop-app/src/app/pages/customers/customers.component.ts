import { Component, OnInit } from "@angular/core";
import { Router, Route } from "@angular/router";

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"]
})
export class CustomersComponent implements OnInit {

  constructor( private router: Router ) {
    this.printpath("", this.router.config);
  }

  // tslint:disable-next-line: no-empty
  ngOnInit(): void {}

  // tslint:disable-next-line: typedef
  printpath(parent: String, config: Route[]) {
    // tslint:disable-next-line: typedef
    for (let i = 0; i < config.length; i++) {
      // tslint:disable-next-line: typedef
      const route = config[i];
      console.log(parent + "/" + route.path);
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
