import {Component, ElementRef, Input, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {Dialog} from "@angular/cdk/dialog";
import {PopupType} from "../../../../types/popup.type";
import {CategoryType} from "../../../../types/category.type";
import {Subscription} from "rxjs";
import {CategoriesService} from "../../services/categories.service";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html'
})

export class PopupComponent implements OnDestroy {
  @ViewChild('popup')
  popup!: TemplateRef<ElementRef>;

  @Input() popupType: PopupType = PopupType.thanks;
  @Input() popupTitle: string = '';
  @Input() popupButtonText: string = '';
  @Input() serviceName: string = '';

  services: CategoryType[] = [];

  private subscription: Subscription | null = null;

  constructor(private dialog: Dialog, private categoriesService: CategoriesService) { }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  open(): void {
    if (this.popupType === PopupType.order) {
      this.subscription = this.categoriesService.getCategories()
        .subscribe((data: CategoryType[]) => {
          this.services = data.filter((item: CategoryType) => item.name !== this.serviceName);
        });
    }

    this.dialog.open(this.popup);
  }

  close(): void {
    this.dialog.closeAll();
  }
}
