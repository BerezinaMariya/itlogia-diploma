import {Component, ViewChild} from '@angular/core';
import {PopupComponent} from "../../components/popup/popup.component";
import {PopupType} from "../../../../types/popup.type";
import {NavMenuType} from "../../../../types/nav-menu.type";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  @ViewChild(PopupComponent)
  private popupComponent!: PopupComponent;

  popupType: PopupType = PopupType.consultation;
  footerMenu: NavMenuType = NavMenuType.footer;

  constructor() {}

  openDialog() {
    this.popupComponent.open();
  }
}
