import { Component, OnInit } from '@angular/core';
import { PublicSessionsStateService } from './services/public-sessions-state.service';
import { Observable } from 'rxjs';
import { PublicSessionSummaryResponse } from '../../core/models/public-session-summary-response.model';
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

@Component({
  selector: 'app-public-sessions',
  standalone: true,
  imports: [
    PublicSessionSummaryComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    CommonModule,
  ],
  providers: [PublicSessionsStateService],
  templateUrl: './public-sessions.component.html',
  styleUrl: './public-sessions.component.scss',
})
export class PublicSessionsComponent implements OnInit {
  publicSessionSummaries$: Observable<PublicSessionSummaryResponse[]>;
  loading$: Observable<boolean>;

  constructor(
    private publicSessionsStateService: PublicSessionsStateService,
    private dialog: MatDialog,
  ) {
    this.publicSessionSummaries$ = this.publicSessionsStateService.publicSessions$;
    this.loading$ = this.publicSessionsStateService.loadingState$;
  }

  ngOnInit() {
    this.publicSessionsStateService.loadPublicSessions();
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
}
