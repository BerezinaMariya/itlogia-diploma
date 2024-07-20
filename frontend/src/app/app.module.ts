import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from "./views/main/main.component";
import {FooterComponent} from "./shared/layout/footer/footer.component";
import {HeaderComponent} from "./shared/layout/header/header.component";
import {LayoutComponent} from "./shared/layout/layout.component";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {AuthInterceptor} from "./core/auth/auth.interceptor";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatMenuModule} from "@angular/material/menu";
import {NgxMaskModule} from "ngx-mask";
import {CarouselModule} from "ngx-owl-carousel-o";
import {SharedModule} from "./shared/shared.module";
import {NgxPageScrollModule} from "ngx-page-scroll";
import {NgxPageScrollCoreModule} from "ngx-page-scroll-core";
import { PolicyPageComponent } from './views/policy-page/policy-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    PolicyPageComponent
  ],
  imports: [
    SharedModule,
    MatSnackBarModule,
    MatMenuModule,
    HttpClientModule,
    NgxMaskModule.forRoot(),
    NgxPageScrollModule,
    NgxPageScrollCoreModule.forRoot({duration: 300}),
    CarouselModule,
    BrowserModule,
    NoopAnimationsModule,
    AppRoutingModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
