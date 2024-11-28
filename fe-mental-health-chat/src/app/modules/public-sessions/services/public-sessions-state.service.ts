import { Injectable } from '@angular/core';
import { PublicSessionsApiService } from '../../../core/api-services/public-sessions-api.service';
import { PublicSessionSummaryResponse } from '../../../core/models/common/public-session-summary-response.model';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { PublicSessionFollowType } from '../../../core/models/enums/public-session-follow-type.enum';

@Injectable()
export class PublicSessionsStateService {
  private publicSessionsSubject = new BehaviorSubject<PublicSessionSummaryResponse[]>([]);
  readonly publicSessions$ = this.publicSessionsSubject.asObservable();

  private loadingStateSubject = new BehaviorSubject(false);
  readonly loadingState$ = this.loadingStateSubject.asObservable();

  constructor(private publicSessionsApiService: PublicSessionsApiService) {}

  loadPublicSessions() {
    this.loadingStateSubject.next(true);

    this.publicSessionsApiService
      .getPublicSessionSummaries({ isCancelled: false })
      .pipe(finalize(() => this.loadingStateSubject.next(false)))
      .subscribe(publicSessions => {
        this.publicSessionsSubject.next(publicSessions);
      });
  }

  followPublicSession(
    publicSessionId: string,
    newType: PublicSessionFollowType,
  ) {
    this.publicSessionsApiService
      .followPublicSession(publicSessionId, { newType })
      .pipe(tap(() => this.loadPublicSessions()))
      .subscribe();
  }
}
