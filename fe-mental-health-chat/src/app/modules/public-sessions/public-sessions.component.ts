import { Component, OnInit } from '@angular/core';
import { PublicSessionsStateService } from './services/public-sessions-state.service';
import { combineLatest, filter, Observable } from 'rxjs';
import { PublicSessionSummaryResponse } from '../../core/models/common/public-session-summary-response.model';
import { PublicSessionSummaryComponent } from '../../shared/components/public-session-summary/public-session-summary.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { PublicSessionFollowType } from '../../core/models/enums/public-session-follow-type.enum';
import { MatDialog } from '@angular/material/dialog';
import {
  PublicSessionFollowersDialogComponent
} from '../../shared/components/public-session-followers-dialog/public-session-followers-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { IssueTag } from '../../core/models/common/issue-tag.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-public-sessions',
  standalone: true,
  imports: [
    PublicSessionSummaryComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    CommonModule,
    MatChipsModule
  ],
  providers: [PublicSessionsStateService],
  templateUrl: './public-sessions.component.html',
  styleUrl: './public-sessions.component.scss',
})
export class PublicSessionsComponent implements OnInit {
  issueTags$: Observable<IssueTag[]>;
  publicSessionSummaries$: Observable<PublicSessionSummaryResponse[]>;
  loading$: Observable<boolean>;

  constructor(
    private publicSessionsStateService: PublicSessionsStateService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.publicSessionSummaries$ = this.publicSessionsStateService.publicSessions$;
    this.loading$ = this.publicSessionsStateService.loadingState$;
    this.issueTags$ = this.publicSessionsStateService.tags$;
  }

  ngOnInit() {
    this.publicSessionsStateService.loadTags();
    combineLatest([
      this.publicSessionsStateService.tags$.pipe(filter(tags => tags.length > 0)),
      this.route.queryParams,
    ]).subscribe(([issueTags, params]) => {
      const issueTagIds = params['issueTagIds'] ? params['issueTagIds'] : [];
      if (issueTagIds.length > 0) {
        const requestIssueTags = issueTags.filter(tag => issueTagIds.includes(tag.id));
        this.publicSessionsStateService.setSelectedIssueTags(requestIssueTags);
      }
      this.publicSessionsStateService.loadPublicSessions();
    });
  }

  onFollowPublicSession(
    newType: PublicSessionFollowType,
    publicSession: PublicSessionSummaryResponse
  ) {
    if (newType === publicSession.followingType) return;
    this.publicSessionsStateService.followPublicSession(
      publicSession.id!,
      newType,
    );
  }

  openFollowersDialog(publicSessionId: string) {
    this.dialog.open(PublicSessionFollowersDialogComponent, {
      data: publicSessionId,
    })
  }

  onIssueTagSelect(issueTag: IssueTag) {
    this.publicSessionsStateService.onIssueTagSelect(issueTag);
  }

  isTagSelected(issueTag: IssueTag) {
    return this.publicSessionsStateService.isTagSelected(issueTag);
  }
}
