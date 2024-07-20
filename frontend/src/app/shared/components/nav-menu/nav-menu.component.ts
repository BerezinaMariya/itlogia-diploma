import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {PageScrollService} from "ngx-page-scroll-core";
import {DOCUMENT} from "@angular/common";
import {NavigationEnd, Router} from "@angular/router";
import {filter, Subscription} from "rxjs";
import {NavMenuType} from "../../../../types/nav-menu.type";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit, OnDestroy {
  @Input() menu: NavMenuType = NavMenuType.header;

  private subscription: Subscription | null = null;

  constructor(private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: Document, private router: Router) {
  }

  ngOnInit() {
    this.subscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((val) => {
        this.document.querySelectorAll('.nav-menu-item').forEach(item => item.classList.remove('active'));
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onPageScroll(elementId: string, event: Event) {
    setTimeout(() => {
      this.pageScrollService.scroll({
        document: this.document,
        scrollTarget: `#${elementId}`,
      });

      const liElement: HTMLElement = (event.target as HTMLElement).parentElement!;

      this.document.querySelectorAll('.nav-menu-item').forEach(item => {
        console.log(item);
        item.classList.remove('active');
      });

      this.document.querySelectorAll(`#${liElement.id}`).forEach(item => {
        if (item.closest('div')!.classList.contains('medium')) {
          item.classList.add('active');
        }
      });

    }, 50);
  }

}
