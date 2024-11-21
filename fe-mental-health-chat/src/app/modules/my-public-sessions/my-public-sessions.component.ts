import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { PublicSessionSummaryResponse } from '../../core/models/public-session-summary-response.model';
import { PublicSessionSummaryComponent } from '../../shared/components/public-session-summary/public-session-summary.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CreateUpdatePublicSessionDialogComponent } from './components/create-update-public-session-dialog/create-update-public-session-dialog.component';
import { CreateUpdatePublicSessionRequest } from '../../core/models/modules/my-public-session/create-update-public-session-request.model';
import { MyPublicSessionsStateService } from './services/my-public-sessions-state.service';
import { Observable } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { mapPublicSessionSummaryResponseToCreateUpdatePublicSessionRequest } from '../../core/mappers';
import { format, parse } from 'date-fns';
import {
  PublicSessionFollowersDialogComponent
} from '../../shared/components/public-session-followers-dialog/public-session-followers-dialog.component';

@Component({
  selector: 'app-my-public-sessions',
  standalone: true,
  imports: [
    PublicSessionSummaryComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    CommonModule,
  ],
  providers: [MyPublicSessionsStateService],
  templateUrl: './my-public-sessions.component.html',
  styleUrl: './my-public-sessions.component.scss',
})
export class MyPublicSessionsComponent implements OnInit {
  publicSessionSummaries$: Observable<PublicSessionSummaryResponse[]>;
  loading$: Observable<boolean>;

  constructor(
    private dialog: MatDialog,
    private viewContainerRef: ViewContainerRef,
    private stateService: MyPublicSessionsStateService
  ) {
    this.publicSessionSummaries$ = this.stateService.publicSessionSummaries$;
    this.loading$ = this.stateService.loadingState$;
  }

  ngOnInit(): void {
    this.stateService.loadPublicSessionSummaries();
  }

  openPublicSessionDialog(request?: CreateUpdatePublicSessionRequest) {
    const startTime = request && format(parse(request.startTime, 'HH:mm:ss', new Date()), 'hh:mm a');
    const endTime = request && format(parse(request.endTime, 'HH:mm:ss', new Date()), 'hh:mm a');

    this.dialog.open(CreateUpdatePublicSessionDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      data: { ...request, startTime, endTime },
      maxWidth: '992px',
    });
  }

  onEditClick(publicSession: PublicSessionSummaryResponse) {
    const request =
      mapPublicSessionSummaryResponseToCreateUpdatePublicSessionRequest(publicSession);
    this.openPublicSessionDialog(request);
  }

  openFollowersDialog(publicSessionId: string) {
    this.dialog.open(PublicSessionFollowersDialogComponent, {
      data: publicSessionId,
    })
  }
}
