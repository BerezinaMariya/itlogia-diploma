import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../services/user.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {NavMenuType} from "../../../../types/nav-menu.type";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLogged: boolean = false;
  userName: string | null = this.authService.userName;
  activeElement: HTMLElement | null = null;
  headerMenu: NavMenuType = NavMenuType.header

  private subscription: Subscription = new Subscription();

  constructor(private authService: AuthService,
              private userService: UserService,
              private _snackBar: MatSnackBar,
              private router: Router) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.activeElement?.classList.remove('.active');

    this.subscription.add(this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;

      if (this.isLogged) {
        this.getUserInfo();
      }
    }));
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private getUserInfo() {
    this.subscription.add(this.userService.getUserInfo()
      .subscribe({
        next: (data: UserInfoType | DefaultResponseType) => {
          let userInfoError = null;

          if ((data as DefaultResponseType).error !== undefined) {
            userInfoError = (data as DefaultResponseType).message;
          }

          const userInfoResponse: UserInfoType = data as UserInfoType;

          if (!userInfoResponse.id || !userInfoResponse.name || !userInfoResponse.email) {
            userInfoError = 'Ошибка при запросе данных пользователя';
          }

          if (userInfoError) {
            this._snackBar.open(userInfoError);
            throw new Error(userInfoError);
          }

          if (userInfoResponse && userInfoResponse.name) {
            this.authService.userName =  userInfoResponse.name;
            this.userName = userInfoResponse.name;
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка при запросе данных пользователя');
          }
        }
      }));
  }

  logout(): void {
    this.subscription.add(this.authService.logout()
      .subscribe({
        next: (data: DefaultResponseType) => {
          this.doLogout();
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.doLogout();
        }
      }));
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.userName = 'user';

    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }
}
