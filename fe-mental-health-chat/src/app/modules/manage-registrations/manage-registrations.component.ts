import { Component, ViewContainerRef } from '@angular/core';
import { ManageRegistrationsStateService } from './services/manage-registrations-state.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ClientRegistrationResponse } from '../../core/models/modules/manage-registrations/client-registration-response.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PrivateSessionRegistrationStatusPipe } from '../../shared/pipes/private-session-registration-status.pipe';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationDetailDialogComponent } from './components/registration-detail-dialog/registration-detail-dialog.component';

@Component({
  selector: 'app-manage-registrations',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, PrivateSessionRegistrationStatusPipe],
  providers: [ManageRegistrationsStateService],
  templateUrl: './manage-registrations.component.html',
  styleUrl: './manage-registrations.component.scss',
})
export class ManageRegistrationsComponent {
  isLoading$: Observable<boolean>;
  registrations$: Observable<ClientRegistrationResponse[]>;

  constructor(
    private stateService: ManageRegistrationsStateService,
    private dialog: MatDialog,
    private viewContainerRef: ViewContainerRef
  ) {
    this.isLoading$ = stateService.isLoading$;
    this.registrations$ = stateService.registrations$;
  }

  openRegistrationDetailDialog(id: string): void {
    const registrationDetail = this.stateService.getRegistrationById(id);
    if (registrationDetail === null) return;

    this.dialog.open(RegistrationDetailDialogComponent, {
      viewContainerRef: this.viewContainerRef, // make state service instance reusable in dialog
      data: registrationDetail,
      maxWidth: '992px',
    });
  }
}
