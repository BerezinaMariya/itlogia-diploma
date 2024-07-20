import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {PasswordService} from "../../../shared/services/password.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^(([А-ЯЁ][а-яё]*)+\s*)*$/)]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    agree: [false]
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

  signup() {
    if (this.signupForm.valid && this.signupForm.value.name && this.signupForm.value.email
      && this.signupForm.value.password && this.signupForm.value.agree) {
      this.subscription.add(this.authService.signup(
        this.signupForm.value.name,
        this.signupForm.value.email,
        this.signupForm.value.password
      ).subscribe({
          next: (data: LoginResponseType | DefaultResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }

            const loginResponse = data as LoginResponseType;

            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Ошибка регистрации';
            }

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;

            this._snackBar.open('Вы успешно зарегистрировались');
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка регистрации');
            }
          }
        }));
    }
  }

  togglePasswordVisible() {
    this.passwordService.toggle(this.isPasswordVisible);
  }

}
