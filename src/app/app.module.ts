import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "app/app.component";
import { SketchPageComponent } from "app/layout/sketch-page/sketch-page.component";

import { SycadRoutingModule } from "@sycadApp/sycad-routing.module";
import { GeneralGlobalSharedModule } from "@sycadApp/shared/generalShared.module";
import { LayoutModule } from "@sycadLayout/layout.module";

import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { MatElementForSketchModule } from "./shared/materialForSketchShared.module";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatCardModule } from "@angular/material/card";
import { ErrorInterceptor } from './features/transverse/login/_helpers/error.interceptor';
import { HttpRequestInterceptor } from './features/transverse/login/_helpers/httpRequestInterceptor';




export function windowFactory() {
  return window;
}

@NgModule({
  declarations: [AppComponent, SketchPageComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SycadRoutingModule,
    FormsModule,
    MatElementForSketchModule,
    GeneralGlobalSharedModule,
    MatCardModule,
    LayoutModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
    { provide: "window", useFactory: windowFactory }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
