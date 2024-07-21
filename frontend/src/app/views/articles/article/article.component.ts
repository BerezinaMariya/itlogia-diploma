import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {AuthService} from "../../../core/auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleService} from "../../../shared/services/article.service";
import {Subscription} from "rxjs";
import {environment} from "../../../../environments/environment";
import {CommentsType} from "../../../../types/comments.type";
import {CommentService} from "../../../shared/services/comment.service";
import {CommentType} from "../../../../types/comment.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentActionType} from "../../../../types/comment-action.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CommentActionsType} from "../../../../types/comment-actions.type";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy {
  isLogged: boolean = false;
  article!: ArticleType;
  relatedArticles: ArticleType[] = [];
  comments!: CommentType[];
  viewComments!: CommentType[];
  commentsCount: number = 0;
  commentTextValue: string = '';
  serverStaticPath: string = environment.serverStaticPath;
  commentsActions: CommentActionType[] = [];
  offsetCommentsCount: number = 3;
  isLoading: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(private authService: AuthService,
              private articleService: ArticleService,
              private commentService: CommentService,
              private activatedRoute: ActivatedRoute,
              private _snackBar: MatSnackBar) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.subscription.add(this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    }));

    this.subscription.add(this.activatedRoute.params.subscribe(params => {
      this.subscription.add(this.articleService.getArticle(params['url'])
        .subscribe((data: ArticleType) => {
          this.article = data;

          this.getComments();
        }));

      this.subscription.add(this.articleService.getRelatedArticles(params['url'])
        .subscribe((data: ArticleType[]) => {
          this.relatedArticles = data;
        }));
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getComments(offset: number = 0) {
    this.isLoading = true;
    this.subscription.add(this.commentService.getComments(this.article.id, offset)
      .subscribe((data: CommentsType) => {
        this.comments = data.comments;
        this.commentsCount = data.allCount;

        if (this.offsetCommentsCount === 3) {
          this.viewComments = this.comments.slice(0, this.offsetCommentsCount);
        } else if (this.offsetCommentsCount > 3) {
          this.viewComments = this.viewComments.concat(this.comments);
        }

        this.getArticleCommentsActions();
        this.isLoading = false;
      }));
  }

  getArticleCommentsActions() {
    if (!this.authService.getIsLoggedIn()) {
      return;
    }

    this.subscription.add(this.commentService.getArticleCommentsActions(this.article.id)
      .subscribe({
        next: (data: CommentActionType[] | DefaultResponseType) => {
          let error = null;
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }

          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          this.commentsActions = data as CommentActionType[];

          this.comments.map((comment: CommentType) => {
            const commentAction: CommentActionType | undefined = this.commentsActions.find((item: CommentActionType) => comment.id === item.comment);
            if (commentAction) {
              comment.isLike = commentAction.action === CommentActionsType.like;
              comment.isDislike = commentAction.action === CommentActionsType.dislike;
            }
          });

        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка запроса примененных действий');
          }
        }
      }));
  }

  postComment() {
    this.subscription.add(this.commentService.postComment(this.commentTextValue, this.article.id)
      .subscribe({
        next: (data) => {
          let error = null;
          if (data.error) {
            error = data.message;
          }

          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          this._snackBar.open('Ваш комментарий отправлен');
          this.commentTextValue = '';
          this.getComments();
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка при отправке комментария');
          }
        }
      }));
  }

  addComments() {
    this.getComments(this.offsetCommentsCount);
    this.offsetCommentsCount += 10;
  }

  share(socialName: string) {
    const head: HTMLHeadElement | null = document.querySelector("head");

    if (head) {
      if (socialName === 'vk' || socialName === 'facebook') {
        //   const metaTitle: HTMLMetaElement = document.getElementById('metaTitle') as HTMLMetaElement;
        //   metaTitle.content = this.article.title;
        //
        //   const metaDescription: HTMLMetaElement = document.getElementById('metaDescription') as HTMLMetaElement;
        //   metaDescription.content = this.article.description;
        //
        //   const metaImage: HTMLMetaElement = document.getElementById('metaImage') as HTMLMetaElement;
        //   metaImage.content = environment.serverStaticPath + this.article.image;
        //
        //
        //   const metaUrl: HTMLMetaElement = document.getElementById('metaUrl') as HTMLMetaElement;
        //   metaUrl.content = "https://angularappexample.ru/articles/" + this.article.url;
        //
        //   const metaSiteName: HTMLMetaElement = document.getElementById('metaSiteName') as HTMLMetaElement;
        //   metaSiteName.content = this.article.title;
        // } else if (socialName === 'instagram') {
        //   console.log('instagram');
        // }

        setTimeout(() => {
          window.open('https://vk.com//share.php?url=https://angularappexample.ru/articles/' + this.article.url, '_blank');
        }, 500);

      }
    }
  }

}
