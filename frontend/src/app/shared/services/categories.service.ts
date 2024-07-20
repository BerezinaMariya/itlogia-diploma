import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {CategoryType} from "../../../types/category.type";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private http: HttpClient) { }

  public getCategories(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(environment.api + 'categories');
  }
}
