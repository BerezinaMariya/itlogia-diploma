import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {Subscription} from "rxjs";
import {PasswordService} from "../../../shared/services/password.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  isPasswordVisible: boolean = false;

  private subscription: Subscription = new Subscription();
  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private passwordService: PasswordService,
              private _snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit() {
    this.subscription.add(this.passwordService.isPasswordVisible$.subscribe((isPasswordVisible: boolean) => {
      this.isPasswordVisible = isPasswordVisible;
    }));
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.subscription.add(this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password,
        !!this.loginForm.value.rememberMe
      ).subscribe({
          next: (data: LoginResponseType | DefaultResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }

            const loginResponse: LoginResponseType = data as LoginResponseType;

            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Ошибка авторизации';
            }

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;

            this._snackBar.open('Вы успешно авторизовались');
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка авторизации');
            }
          }
        }));
    }
  }

  togglePasswordVisible() {
    this.passwordService.toggle(this.isPasswordVisible);
  }
}
