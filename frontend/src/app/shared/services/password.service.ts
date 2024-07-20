import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  isPasswordVisible$: Subject<boolean> = new Subject();

  constructor() {
  }

  toggle(isPasswordVisible: boolean) {
    this.isPasswordVisible$.next(!isPasswordVisible);
  }
}
