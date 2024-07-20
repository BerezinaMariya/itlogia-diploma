import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./views/main/main.component";
import {LayoutComponent} from "./shared/layout/layout.component";
import {AuthForwardGuard} from "./core/auth/auth-forward.guard";
import {PolicyPageComponent} from "./views/policy-page/policy-page.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: MainComponent},
      {path: 'policy', component: PolicyPageComponent},
      {path: '', loadChildren: () => import('./views/user/user.module').then(m => m.UserModule), canActivate: [AuthForwardGuard]},
      {path: '', loadChildren: () => import('./views/articles/articles.module').then(m => m.ArticlesModule)},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled', enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
