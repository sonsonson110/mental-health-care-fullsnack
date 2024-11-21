import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateUpdatePublicSessionRequest } from '../models/modules/my-public-session/create-update-public-session-request.model';
import { PublicSessionSummariesRequest } from '../models/public-session-summaries-request';
import { PublicSessionSummaryResponse } from '../models/public-session-summary-response.model';
import { FollowPublicSessionRequest } from '../models/modules/public-sessions/follow-public-session-request.model';
import { PublicSessionFollowerResponse } from '../models/public-session-follower-response.model';

@Injectable({
  providedIn: 'root',
})
export class PublicSessionsApiService {
  private readonly baseEndpoint = environment.apiBaseUrl + '/public-sessions';

  constructor(private http: HttpClient) {}

  getPublicSessionSummaries(request?: PublicSessionSummariesRequest) {
    let params = new HttpParams();
    if (request) {
      if (request.therapistId != undefined) {
        params = params.set('therapistId', request.therapistId);
      }
      if (request.isCancelled != undefined) {
        params = params.set('isCancelled', request.isCancelled);
      }
    }
    return this.http.get<PublicSessionSummaryResponse[]>(this.baseEndpoint, {
      params: params,
    });
  }

  createPublicSession(request: CreateUpdatePublicSessionRequest) {
    return this.http.post<{ id: string }>(this.baseEndpoint, request);
  }

  updatePublicSession(request: CreateUpdatePublicSessionRequest) {
    return this.http.put(this.baseEndpoint, request);
  }

  followPublicSession(publicSessionId: string, request: FollowPublicSessionRequest) {
    return this.http.patch(`${this.baseEndpoint}/${publicSessionId}/follow`, request);
  }

  getPublicSessionFollowers(publicSessionId: string) {
    return this.http.get<PublicSessionFollowerResponse[]>(`${this.baseEndpoint}/${publicSessionId}/followers`);
  }
}
