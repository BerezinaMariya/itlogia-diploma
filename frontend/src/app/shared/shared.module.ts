import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PopupComponent} from "./components/popup/popup.component";
import {LoaderComponent} from "./components/loader/loader.component";
import {PopupFormComponent} from "./components/popup-form/popup-form.component";
import {ArticleCardComponent} from "./components/article-card/article-card.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DialogModule} from "@angular/cdk/dialog";
import {RouterModule} from "@angular/router";
import { CommentCardComponent } from './components/comment-card/comment-card.component';
import {ServiceCardComponent} from "./components/service-card/service-card.component";
import {PriceFormatPipe} from "./pipes/price-format.pipe";
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { CommentDatePipe } from './pipes/comment-date.pipe';

@NgModule({
  declarations: [
    PopupComponent,
    PopupFormComponent,
    LoaderComponent,
    ArticleCardComponent,
    CommentCardComponent,
    ServiceCardComponent,
    NavMenuComponent,
    PriceFormatPipe,
    CommentDatePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    RouterModule
  ],
  exports: [
    PopupComponent,
    PopupFormComponent,
    LoaderComponent,
    ArticleCardComponent,
    CommentCardComponent,
    ServiceCardComponent,
    NavMenuComponent,
    PriceFormatPipe,
    CommentDatePipe
  ]
})
export class SharedModule { }
