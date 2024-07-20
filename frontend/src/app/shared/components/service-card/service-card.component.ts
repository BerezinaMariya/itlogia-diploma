import {Component, Input, ViewChild} from '@angular/core';
import {ServiceType} from "../../../../types/service.type";
import {PopupComponent} from "../popup/popup.component";
import {PopupType} from "../../../../types/popup.type";

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent {
  @Input() service!: ServiceType;

  @ViewChild(PopupComponent)
  private popupComponent!: PopupComponent;

  popupType: PopupType = PopupType.order;

  constructor() {}

  openDialog() {
    this.popupComponent.open();
  }

}
