import {Component, Input, OnDestroy} from '@angular/core';
import {CommentType} from "../../../../types/comment.type";
import {CommentActionsType} from "../../../../types/comment-actions.type";
import {CommentService} from "../../services/comment.service";
import {Subscription} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CommentActionType} from "../../../../types/comment-action.type";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnDestroy {
  @Input() comment!: CommentType;

  commentActions = {
    like: CommentActionsType.like,
    dislike: CommentActionsType.dislike,
    violate: CommentActionsType.violate
  }

  actionsCount = {
    like: 0,
    dislike: 0
  }

  private subscription: Subscription = new Subscription();

  constructor(private commentService: CommentService,
              private authService: AuthService,
              private _snackBar: MatSnackBar) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCommentAction(commentAction: CommentActionsType) {
    if (!this.authService.getIsLoggedIn()) {
      this._snackBar.open('Для того, чтобы отправлять реакцию или жалобу, необходимо авторизоваться');
      return;
    }

    this.subscription.add(this.commentService.applyCommentAction(this.comment.id, commentAction)
      .subscribe({
        next: (data: DefaultResponseType) => {
          let error = null;
          if (data.error) {
            if (commentAction === this.commentActions.violate && data.message === "Это действие уже применено к комментарию") {
              error = "Жалоба уже отправлена";
            } else {
              error = data.message;
            }
          }

          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          if (commentAction === this.commentActions.violate) {
            this._snackBar.open('Жалоба отправлена');
          } else {
            this._snackBar.open('Ваш голос учтен');
          }

          this.getCommentAction();
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка при отправке запроса');
          }
        }
      }));
  }

  getCommentAction() {
    this.subscription.add(this.commentService.getCommentAction(this.comment.id)
      .subscribe({
        next: (data: CommentActionType[] | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          const commentActionResponse: CommentActionType[] = data as CommentActionType[];
          if (commentActionResponse.length > 0) {
            this.comment.isLike = commentActionResponse[0].action === this.commentActions.like;
            this.comment.isDislike = commentActionResponse[0].action === this.commentActions.dislike;
          } else {
            this.comment.isLike = false;
            this.comment.isDislike = false;
          }

          this.actionsCount.like = +this.comment.isLike;
          this.actionsCount.dislike = +this.comment.isDislike;
        }
      }));
  }

}
