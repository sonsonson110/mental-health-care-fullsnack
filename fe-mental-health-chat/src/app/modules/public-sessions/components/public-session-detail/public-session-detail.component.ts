import { Component, OnInit } from '@angular/core';
import { PublicSessionsApiService } from '../../../../core/api-services/public-sessions-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicSessionSummaryComponent } from '../../../../shared/components/public-session-summary/public-session-summary.component';
import { PublicSessionSummaryResponse } from '../../../../core/models/common/public-session-summary-response.model';
import { PublicSessionFollowType } from '../../../../core/models/enums/public-session-follow-type.enum';
import { switchMap, tap } from 'rxjs';
import {
  PublicSessionFollowersDialogComponent
} from '../../../../shared/components/public-session-followers-dialog/public-session-followers-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-public-session-detail',
  standalone: true,
  imports: [PublicSessionSummaryComponent],
  templateUrl: './public-session-detail.component.html',
  styleUrl: './public-session-detail.component.scss',
})
export class PublicSessionDetailComponent implements OnInit {
  summary: PublicSessionSummaryResponse | null = null;

  constructor(
    private publicSessionsApiService: PublicSessionsApiService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadPublicSession();
  }

  private loadPublicSession() {
    this.route.params
      .pipe(
        switchMap(params =>
          this.publicSessionsApiService.getPublicSessionSummary(params['id'])
        )
      )
      .subscribe({
        next: summary => (this.summary = summary),
        error: () => {
          this.router.navigate(['not-found']);
        },
      });
  }

  onFollowPublicSession(
    event: PublicSessionFollowType,
    summary: PublicSessionSummaryResponse
  ) {
    this.publicSessionsApiService
      .followPublicSession(summary.id!, { newType: event })
      .pipe(tap(() => this.loadPublicSession()))
      .subscribe();
  }

  openFollowersDialog(publicSessionId: string) {
    this.dialog.open(PublicSessionFollowersDialogComponent, {
      data: publicSessionId,
    })
  }
}
