import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArticleCardType} from "../../../../types/article-card.type";
import {debounceTime, Subscription} from "rxjs";
import {ArticleService} from "../../../shared/services/article.service";
import {ArticlesResponseType} from "../../../../types/articles-response.type";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoriesService} from "../../../shared/services/categories.service";
import {CategoryType} from "../../../../types/category.type";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, OnDestroy {
  articles: ArticleCardType[] = [];
  categories: CategoryType[] = [];

  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];
  pages: number[] = [];
  viewPages: number[] = [];

  private subscription: Subscription = new Subscription();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private categoriesService: CategoriesService,
              private articleService: ArticleService) {
  }

  ngOnInit(): void {
    this.subscription.add(this.categoriesService.getCategories()
      .subscribe((data: CategoryType[]) => {
        this.categories = data;
      }));

    this.subscription.add(this.activatedRoute.queryParams
      .pipe(
        debounceTime(500)
      )
      .subscribe(params => {
        this.activeParams = ActiveParamsUtil.processParams(params);
        this.appliedFilters = [];

        this.activeParams.categories.forEach((url: string) => {
          const foundCategory = this.categories.find((category: CategoryType) => category.url === url);

          if (foundCategory) {
            this.appliedFilters.push({
              name: foundCategory.name,
              urlParam: foundCategory.url
            });
          }
        });
        this.getArticles();
      }));
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  getArticles() {
    this.subscription.add(this.articleService.getArticles(this.activeParams)
      .subscribe((data: ArticlesResponseType) => {
        this.pages = [];
        for (let i = 1; i <= data.pages; i++) {
          this.pages.push(i);
        }
        this.viewPages = this.pages;
        this.articles = data.items;

        this.hidePages();
      }));
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    this.activeParams.categories = this.activeParams.categories.filter((item => item !== appliedFilter.urlParam));

    this.getArticles();

    this.activeParams.page = 1;

    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  updateActiveCategories(category: CategoryType) {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingCategoryInParams = this.activeParams.categories.find(item => item === category.url);

      if (existingCategoryInParams) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== category.url);
      } else if (!existingCategoryInParams) {
        this.activeParams.categories = [...this.activeParams.categories, category.url];
      }
    } else {
      this.activeParams.categories = [category.url];
    }

    this.getArticles();

    this.activeParams.page = 1;

    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  openPage(page: number) {
    this.activeParams.page = page;

    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;

      this.router.navigate(['/articles'], {
        queryParams: this.activeParams
      });
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;

      this.router.navigate(['/articles'], {
        queryParams: this.activeParams
      });
    }
  }

  hidePages() {
    this.viewPages = [];
    this.activeParams.page = this.activeParams.page ? this.activeParams.page : 1;
    for (let i: number = 1; i <= this.pages.length; i++) {
      if (i === this.activeParams.page || i === this.activeParams.page + 1 || i === this.activeParams.page - 1) {
        this.viewPages.push(i);
      }
    }
  }

}


