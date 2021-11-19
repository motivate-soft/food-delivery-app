import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from "@angular/core";
import { CartItem, Category, Product } from "../../../../services/shop/shop.model";
import { ApplicationService } from "../../../../state/application.service";
import { ApplicationQuery } from "../../../../state/application.query";

import { KEY_CODE } from "../../../../enums/keyboard.enum";
import { forkJoin, combineLatest } from "rxjs";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"]
})
export class ProductsComponent implements OnInit {


  @ViewChild("filterInput") filterInput: ElementRef<any>;
  @ViewChild("sizeModal") sizeModal: ElementRef<any>;

  products: Product[] = [];
  filtered: Product[] = [];
  categories: {[ key: string]: Category };
  category: Category;
  selectedIdx = 0;
  selected: Product;
  sizeIdx = 0;
  sizeModalVisible = false;
  _resolveSize: any;
  _rejectSize: any;
  quantity = 1;

  constructor(
    private readonly applicationService: ApplicationService,
    private readonly applicationQuery: ApplicationQuery
  ) { }

  ngOnInit(): void {

    combineLatest([
        this.applicationQuery.categories$,
        this.applicationQuery.products$
      ]
    ).subscribe(([categories, products]) => {

      this.products = products;

      this.filtered = products;
      if( Object.keys( categories ).length > 0 ) {
        this.categories = categories;
        this.category = this.categories[ this.filtered[0].category_id ];
        this.applicationService.setCategory( this.category  );
      }
    });
    /*
    this.applicationQuery.categories$.pipe(
      map( categories => {
        this.categories = categories;
        console.log( categories );

        this.applicationQuery.products$.pipe(
          map( products => {

            console.log( products )
            this.products = products;
            this.filtered = products;

              this.category = this.categories[ this.filtered[0].category_id ];
          })
        )
      })
    )*/

    /*
    this.applicationQuery.products$.subscribe( products => {

      if( products.length > 0 ) {
        this.products = products;
        this.filtered = products;
      }
    });

    this.applicationQuery.products$.combineLatest(document$

    this.applicationQuery.categories$.( categories => {
      this.categories = categories;

      console.log( this.filtered );

      this.category = this.categories[ this.filtered[0].category_id ];
      this.applicationService.setCategory( this.category  );
    });
    */
  }

  // tslint:disable-next-line: typedef
  markProduct( event ):void {
    // tslint:disable-next-line: typedef
    const idx = this.selectedIdx;

    if (event.key === KEY_CODE.TAB && this.sizeModalVisible ) {
      // tslint:disable-next-line: typedef
      const len = this.category.sizes.length;
      // tslint:disable-next-line: typedef
      const idx = this.sizeIdx + 1 === len ? 0 : this.sizeIdx + 1;

      this.selectSizeRadio( idx );
    } else if (event.key === KEY_CODE.UP_ARROW && !this.sizeModalVisible) {
      this.selectedIdx = idx === 0 ? 0 : idx - 1;
      this.selected = this.filtered[ this.selectedIdx ];
      event.stopPropagation();
    } else if (event.key === KEY_CODE.DOWN_ARROW && !this.sizeModalVisible) {
      this.selectedIdx = this.products.length ===  idx + 1 ? idx : idx + 1;
      this.selected = this.filtered[ this.selectedIdx ];
    }

    event.stopPropagation();
  }

  // tslint:disable-next-line: typedef
  filter( event ): void {
    let input: string = event.target.value;


    input = input.trim();
    if( !input || input === "") {
      this.filtered = [...this.products ];
    } else {
      this.filtered = this.products.filter( product => {
        return product.code.startsWith( input ) || product.name.toLocaleLowerCase().includes( input );
      });
    }
    this.selectedIdx = 0;
    this.selected = this.filtered[0];

    if( this.categories ) {
      this.category = this.categories[ this.selected.category_id ];
    }
    this.applicationService.setFilter( input );
    this.applicationService.setCategory( this.category  );

    event.stopPropagation();
  }

  // tslint:disable-next-line: typedef
  async addToCart( event ) {

    const { _id, category_id, code, name, description, tax } = this.selected;

    // tslint:disable-next-line: typedef
    let price = this.selected.prices[ this.sizeIdx ];
    // tslint:disable-next-line: typedef
    let size = this.category.sizes[ this.sizeIdx ].name;

    if( this.category.sizes.length > 1 ) {
      this.showSizeModal();

      // tslint:disable-next-line: typedef
      const idx = await this.selectSize();

      price = this.selected.prices[ idx ];
      size = this.category.sizes[ idx ].name;
    }
    const cartItem: CartItem = { _id, category_id, code, name,
                                description, price, quantity: this.quantity, size,
                                size_idx: this.sizeIdx, toppings: [], tax
                              };

    this.applicationService.addToCart(cartItem);

    this.sizeIdx = 0;
    this.quantity = 1;

    this.filterInput.nativeElement.select();
    // this.filtered = [...this.products ];
  }

  // tslint:disable-next-line: typedef
  selectSizeRadio( idx ) {
    this.sizeIdx = idx;
  }

  async selectSize(): Promise<number> {
    return new Promise( (resolve, reject) => {
      this._resolveSize = resolve;
      this._rejectSize = reject;
    });
  }

  // tslint:disable-next-line: typedef
  modalContentClicked( event ) {
    event.stopPropagation();
  }

  // tslint:disable-next-line: typedef
  showSizeModal() {
    this.sizeModal.nativeElement.classList.add("visible");
    this.sizeModalVisible = true;
  }

  // tslint:disable-next-line: typedef
  hideSizeModal() {
    this.sizeModal.nativeElement.classList.remove("visible");
    this.sizeModalVisible = false;
    this._resolveSize( this.sizeIdx );
  }
/*
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    const idx = this.selectedIdx;

    if (event.key === KEY_CODE.TAB && this.sizeModalVisible ) {
      const len = this.category.sizes.length;
      const idx = this.sizeIdx + 1 === len ? 0 : this.sizeIdx + 1;

      this.selectSizeRadio( idx )

      event.stopPropagation();
    }
    else if (event.key === KEY_CODE.UP_ARROW && !this.sizeModalVisible) {
      this.selectedIdx = idx === 0 ? 0 : idx - 1;
    };
    else if (event.key === KEY_CODE.DOWN_ARROW && !this.sizeModalVisible) {
      this.selectedIdx = this.products.length ===  idx + 1 ? idx : idx + 1;
    }

    this.selected = this.filtered[ this.selectedIdx ];
  }
  */

}
