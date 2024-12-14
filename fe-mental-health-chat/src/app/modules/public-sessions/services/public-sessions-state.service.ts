import { Injectable } from '@angular/core';
import { PublicSessionsApiService } from '../../../core/api-services/public-sessions-api.service';
import { PublicSessionSummaryResponse } from '../../../core/models/common/public-session-summary-response.model';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { PublicSessionFollowType } from '../../../core/models/enums/public-session-follow-type.enum';
import { TagsApiService } from '../../../core/api-services/tags-api.service';
import { IssueTag } from '../../../core/models/common/issue-tag.model';

@Injectable()
export class PublicSessionsStateService {
  private publicSessionsSubject = new BehaviorSubject<PublicSessionSummaryResponse[]>([]);
  readonly publicSessions$ = this.publicSessionsSubject.asObservable();

  private tagsSubject = new BehaviorSubject<IssueTag[]>([]);
  readonly tags$ = this.tagsSubject.asObservable();

  private loadingStateSubject = new BehaviorSubject(false);
  readonly loadingState$ = this.loadingStateSubject.asObservable();

  private selectedIssueTagsSubject = new BehaviorSubject<IssueTag[]>([]);
  readonly selectedIssueTags$ = this.selectedIssueTagsSubject.asObservable();

  constructor(
    private publicSessionsApiService: PublicSessionsApiService,
    private tagsApiService: TagsApiService
  ) {}

  loadTags() {
    this.tagsApiService.getAll().subscribe(tags => {
      this.tagsSubject.next(tags);
    });
  }

  loadPublicSessions() {
    this.loadingStateSubject.next(true);

    const issueTagIds = this.selectedIssueTagsSubject.value.map(tag => tag.id);

    this.publicSessionsApiService
      .getPublicSessionSummaries({ isCancelled: false, issueTagIds })
      .pipe(finalize(() => this.loadingStateSubject.next(false)))
      .subscribe(publicSessions => {
        this.publicSessionsSubject.next(publicSessions);
      });
  }

  followPublicSession(publicSessionId: string, newType: PublicSessionFollowType) {
    this.publicSessionsApiService
      .followPublicSession(publicSessionId, { newType })
      .pipe(tap(() => this.loadPublicSessions()))
      .subscribe();
  }

  onIssueTagSelect(tag: IssueTag) {
    const currentSelectedTags = this.selectedIssueTagsSubject.value;
    const index = currentSelectedTags.findIndex(selectedTag => selectedTag.id === tag.id);

    if (index === -1) {
      // Tag not selected, add it
      currentSelectedTags.push(tag);
    } else {
      // Tag already selected, remove it
      currentSelectedTags.splice(index, 1);
    }

    // Update the BehaviorSubject in the service
    this.selectedIssueTagsSubject.next(currentSelectedTags);
    this.loadPublicSessions();
  }

  isTagSelected(tag: IssueTag): boolean {
    return this.selectedIssueTagsSubject.value.some(selectedTag => selectedTag.id === tag.id);
  }

  setSelectedIssueTags(tags: IssueTag[]) {
    this.selectedIssueTagsSubject.next(tags);
  }
}
