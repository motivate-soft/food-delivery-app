import { BrowserModule } from "@angular/platform-browser";

import { LOCALE_ID, NgModule } from "@angular/core";
import { registerLocaleData } from "@angular/common";


import localeDe from "@angular/common/locales/de";
import localeEn from "@angular/common/locales/en";

import { HttpClientModule, HttpClient } from "@angular/common/http";

// nG Translate
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";


import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { SessionService } from "./services/session/session.service";

import { environment } from "../environments/environment";

import { AkitaNgDevtools } from "@datorama/akita-ngdevtools";


registerLocaleData( localeDe );
registerLocaleData( localeEn );

// aoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  // tslint:disable-next-line: typedef
  const loader = new TranslateHttpLoader(http, "./assets/i18n/", ".json");

  return loader;
}


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,

    TranslateModule.forRoot({
      defaultLanguage: "de",
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),

  ],
  providers: [
    { provide: LOCALE_ID,
      deps: [ SessionService],
      useFactory: sessionService => sessionService.locale
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
