import { Injectable } from '@angular/core';
import { TherapistSummaryResponse } from '../../../core/models/modules/therapists/therapist-summary-response.model';
import { BehaviorSubject, finalize, forkJoin } from 'rxjs';
import { TherapistsApiService } from '../../../core/api-services/therapists-api.service';
import { IssueTag } from '../../../core/models/common/issue-tag.model';
import { TagsApiService } from '../../../core/api-services/tags-api.service';
import { TherapistSummariesRequest } from '../../../core/models/modules/therapists/therapist-summaries-request.model';

@Injectable({providedIn: 'root'})
export class TherapistsStateService {
  private therapistSummaries$ = new BehaviorSubject<TherapistSummaryResponse[]>([]);
  therapistSummaries = this.therapistSummaries$.asObservable();

  private issueTags$ = new BehaviorSubject<IssueTag[]>([]);
  issueTags = this.issueTags$.asObservable();

  private loadingState$ = new BehaviorSubject<boolean>(false);
  loadingState = this.loadingState$.asObservable();

  constructor(
    private therapistsService: TherapistsApiService,
    private tagsService: TagsApiService
  ) {
    this.loadAll();
  }

  search(terms: TherapistSummariesRequest) {
    this.loadingState$.next(true);

    this.therapistsService.getTherapistSummaries(terms)
      .pipe(finalize(() => this.loadingState$.next(false)))
      .subscribe(therapistSummaries => this.therapistSummaries$.next(therapistSummaries));
  }

  private loadAll() {
    this.loadingState$.next(true);

    forkJoin({
      therapistSummaries: this.therapistsService.getTherapistSummaries(),
      issueTags: this.tagsService.getAll()
    })
      .pipe(finalize(() => this.loadingState$.next(false)))
      .subscribe(({ therapistSummaries, issueTags }) => {
        this.therapistSummaries$.next(therapistSummaries);
        this.issueTags$.next(issueTags);
      });
  }
}
