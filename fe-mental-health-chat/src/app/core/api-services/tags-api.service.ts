import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { IssueTag } from '../models/common/issue-tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagsApiService {
  readonly baseEndpoint = environment.apiBaseUrl + '/tags';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<IssueTag[]>(this.baseEndpoint);
  }
}
