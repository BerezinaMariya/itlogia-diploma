import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {CommentsType} from "../../../types/comments.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {CommentActionsType} from "../../../types/comment-actions.type";
import {CommentActionType} from "../../../types/comment-action.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  public getComments(article: string, offset: number): Observable<CommentsType> {
    return this.http.get<CommentsType>(environment.api + 'comments', {
      params: {offset, article}
    });
  }

  public postComment(text: string, articleId: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text: text,
      article: articleId
    });
  }

  public applyCommentAction(commentId: string, action: CommentActionsType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {
      action: action
    });
  }

  public getCommentAction(commentId: string): Observable<DefaultResponseType | CommentActionType[]> {
    return this.http.get<DefaultResponseType | CommentActionType[]>(environment.api + 'comments/' + commentId + '/actions');
  }

  public getArticleCommentsActions(articleId: string): Observable<DefaultResponseType | CommentActionType[]> {
    return this.http.get<DefaultResponseType | CommentActionType[]>(environment.api + 'comments/article-comment-actions', {
      params: {articleId}
    });
  }
}
