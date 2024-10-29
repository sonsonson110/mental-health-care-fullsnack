import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/dev.environment';
import { IssueTag } from '../models/issue-tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  readonly baseEndpoint = environment.apiBaseUrl + '/tags';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<IssueTag[]>(this.baseEndpoint);
  }
}
