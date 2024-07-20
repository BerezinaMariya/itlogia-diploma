import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {ArticleCardType} from "../../../types/article-card.type";
import {ArticlesResponseType} from "../../../types/articles-response.type";
import {ActiveParamsType} from "../../../types/active-params.type";
import {ArticleType} from "../../../types/article.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  public getPopularArticles(): Observable<ArticleCardType[]> {
    return this.http.get<ArticleCardType[]>(environment.api + 'articles/top');
  }

  public getArticles(params: ActiveParamsType): Observable<ArticlesResponseType> {
    return this.http.get<ArticlesResponseType>(environment.api + 'articles', {
      params: params
    });
  }

  public getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url)
  }

  public getRelatedArticles(url: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url)
  }
}
