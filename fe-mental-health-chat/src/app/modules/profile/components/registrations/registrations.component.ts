import { Component, OnInit } from '@angular/core';
import { TherapistRegistrationResponse } from '../../../../core/models/common/therapist-registration-response.model';
import { PrivateSessionRegistrationsApiService } from '../../../../core/api-services/private-session-registrations-api.service';
import { finalize } from 'rxjs';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import {
  PrivateSessionRegistrationStatusPipe
} from '../../../../shared/pipes/private-session-registration-status.pipe';
import { MatButtonModule } from '@angular/material/button';
import {
  PrivateSessionRegistrationStatus
} from '../../../../core/models/enums/private-session-registration-status.enum';
import { MatDialog } from '@angular/material/dialog';
import { TherapistReviewDialogComponent } from '../therapist-review-dialog/therapist-review-dialog.component';

@Component({
  selector: 'app-registrations',
  standalone: true,
  imports: [CommonModule, PrivateSessionRegistrationStatusPipe, MatButtonModule],
  templateUrl: './registrations.component.html',
  styleUrl: './registrations.component.scss',
})
export class RegistrationsComponent implements OnInit {
  isLoading = true;
  registrations: TherapistRegistrationResponse[] = [];

  constructor(
    private privateSessionRegistrationsApiService: PrivateSessionRegistrationsApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.privateSessionRegistrationsApiService
      .getTherapistRegistrations()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(registrations => {
        this.registrations = registrations;
      });
  }

  onReviewClick(registration: TherapistRegistrationResponse): void {
    this.dialog.open(TherapistReviewDialogComponent, {
      data: registration,
      minWidth: '490px',
      maxWidth: '992px',
    })
  }

  protected readonly PrivateSessionRegistrationStatus = PrivateSessionRegistrationStatus;
}
