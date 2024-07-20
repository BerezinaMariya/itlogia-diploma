import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PopupType} from "../../../../types/popup.type";
import {RequestService} from "../../services/request.service";
import {Subscription} from "rxjs";
import {RequestType} from "../../../../types/request.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PopupComponent} from "../popup/popup.component";
import {CategoryType} from "../../../../types/category.type";

@Component({
  selector: 'app-popup-form',
  templateUrl: './popup-form.component.html'
})
export class PopupFormComponent implements OnInit, OnDestroy {
  @ViewChild(PopupComponent)
  private popupComponent!: PopupComponent;

  @Input() popupType: PopupType = PopupType.consultation;
  @Input() serviceName: string = '';
  @Input() services: CategoryType[] = [];

  popupForm: FormGroup;
  popupFormButtonText: string;

  private subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder,
              private requestService: RequestService,
              private _snackBar: MatSnackBar)
  {
    if (this.popupType === PopupType.consultation) {
      this.popupFormButtonText = 'Заказать консультацию';
    } else {
      this.popupFormButtonText = 'Оставить заявку';
    }

    this.popupForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^(([А-ЯЁ][а-яё]*)+\s*)*$/)]],
      phone: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.popupType === PopupType.order) {
      this.popupForm = this.fb.group({
        ...this.popupForm.controls,
        service: [this.serviceName, Validators.required]
      });
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  sendRequest() {
    let requestData: RequestType = {
      name: this.popupForm.value.name,
      phone: this.popupForm.value.phone,
      type: this.popupType
    };

    if (this.popupType === PopupType.order) {
      requestData.service = this.popupForm.value.service;
    }

    if (this.popupForm.valid && this.popupForm.value.name && this.popupForm.value.phone && this.popupType
            && (this.popupType === PopupType.order ? this.popupForm.value.service : true)) {
      this.subscription.add(this.requestService.sendRequest(requestData)
        .subscribe({
          next: (requestResponse: DefaultResponseType) => {
            let error = null;
            if (requestResponse.error) {
              error = requestResponse.message;
            }

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            this.popupComponent.close();
            this.popupForm.reset();
            this.popupComponent.open();
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка отправки данных');
            }
          }
        }));
    }

  }
}
