import { Component, OnInit } from '@angular/core';
import { Router, Route } from "@angular/router";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  constructor( private router: Router ) {
    this.printpath('', this.router.config);
  }

  ngOnInit(): void {
    
  }

  printpath(parent: String, config: Route[]) {
    for (let i = 0; i < config.length; i++) {
      const route = config[i];
      console.log(parent + '/' + route.path);
      if (route.children) {
        const currentPath = route.path ? parent + '/' + route.path : parent;
        this.printpath(currentPath, route.children);
      }
    }
  }

  home() {
    this.router.navigateByUrl('/')
  }

}
