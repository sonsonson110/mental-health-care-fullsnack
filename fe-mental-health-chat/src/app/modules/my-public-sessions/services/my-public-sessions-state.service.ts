import { Injectable } from '@angular/core';
import { PublicSessionsApiService } from '../../../core/api-services/public-sessions-api.service';
import { CreateUpdatePublicSessionRequest } from '../../../core/models/modules/my-public-session/create-update-public-session-request.model';
import { PublicSessionSummaryResponse } from '../../../core/models/public-session-summary-response.model';
import { BehaviorSubject, of, switchMap, tap } from 'rxjs';
import { AuthApiService } from '../../../core/api-services/auth-api.service';
import { FilesApiService } from '../../../core/api-services/files-api.service';

@Injectable()
export class MyPublicSessionsStateService {
  private publicSessionSummariesSubject = new BehaviorSubject<
    PublicSessionSummaryResponse[]
  >([]);
  readonly publicSessionSummaries$ = this.publicSessionSummariesSubject.asObservable();

  private loadingStateSubject = new BehaviorSubject<boolean>(true);
  readonly loadingState$ = this.loadingStateSubject.asObservable();

  constructor(
    private publicSessionsApiService: PublicSessionsApiService,
    private authApiService: AuthApiService,
    private filesApiService: FilesApiService
  ) {}

  loadPublicSessionSummaries() {
    this.loadingStateSubject.next(true);
    this.publicSessionsApiService
      .getPublicSessionSummaries({ therapistId: this.authApiService.getSessionUserId() })
      .subscribe(publicSessionSummaries => {
        this.publicSessionSummariesSubject.next(publicSessionSummaries);
        this.loadingStateSubject.next(false);
      });
  }

  private submitPublicSession(
    request: CreateUpdatePublicSessionRequest,
    mode: 'create' | 'update',
  ) {
    const req =
      mode === 'create'
        ? this.publicSessionsApiService.createPublicSession(request)
        : this.publicSessionsApiService.updatePublicSession(request);

    return req.pipe(tap(() => this.loadPublicSessionSummaries()));
  }

  submitPublicSessionWithImage(
    request: CreateUpdatePublicSessionRequest,
    mode: 'create' | 'update',
    thumbnailFile: File | null
  ) {
    const uploadImage$ = thumbnailFile
      ? this.filesApiService.uploadImage(thumbnailFile)
      : of({ fileName: request.thumbnailName });

    return uploadImage$.pipe(
      switchMap((response) => {
        request.thumbnailName = response.fileName;
        return this.submitPublicSession(request, mode);
      })
    );
  }
}
