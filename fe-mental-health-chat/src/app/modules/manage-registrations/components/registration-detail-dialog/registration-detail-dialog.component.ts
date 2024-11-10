import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ClientRegistrationResponse } from '../../../../core/models/modules/manage-registrations/client-registration-response.model';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { GenderPipe } from '../../../../shared/pipes/gender.pipe';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { privateSessionRegistrationStatuses } from '../../../../core/constants/private-session-registration-status.constant';
import { PrivateSessionRegistrationStatus } from '../../../../core/models/enums/private-session-registration-status.enum';
import { ManageRegistrationsStateService } from '../../services/manage-registrations-state.service';

@Component({
  selector: 'app-registration-detail-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    GenderPipe,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './registration-detail-dialog.component.html',
  styleUrl: './registration-detail-dialog.component.scss',
})
export class RegistrationDetailDialogComponent {
  data: ClientRegistrationResponse = inject(MAT_DIALOG_DATA);
  readonly statuses = privateSessionRegistrationStatuses;

  clientRegistrationFormGroup = new FormGroup({
    status: new FormControl({
      value: this.data.status,
      disabled: this.shouldFieldBeDisabled(),
    }),
    noteFromTherapist: new FormControl(
      {
        value: this.data.noteFromTherapist,
        disabled: this.shouldFieldBeDisabled(),
      },
      [Validators.minLength(8), Validators.maxLength(500)]
    ),
  });

  constructor(
    public dialogRef: MatDialogRef<RegistrationDetailDialogComponent>,
    private stateService: ManageRegistrationsStateService
  ) {}

  get getMessageLength(): number {
    return (
      this.clientRegistrationFormGroup.controls.noteFromTherapist.getRawValue()?.length ??
      0
    );
  }

  shouldStatusBeDisabled(status: PrivateSessionRegistrationStatus): boolean {
    if (this.data.status === PrivateSessionRegistrationStatus.PENDING) {
      return !(
        status === PrivateSessionRegistrationStatus.APPROVED ||
        status === PrivateSessionRegistrationStatus.REJECTED
      );
    }
    if (this.data.status === PrivateSessionRegistrationStatus.APPROVED) {
      return !(
        status === PrivateSessionRegistrationStatus.FINISHED ||
        status === PrivateSessionRegistrationStatus.CANCELED
      );
    }
    return true;
  }

  private shouldFieldBeDisabled(): boolean {
    return (
      this.data.status === PrivateSessionRegistrationStatus.FINISHED ||
      this.data.status === PrivateSessionRegistrationStatus.CANCELED ||
      this.data.status === PrivateSessionRegistrationStatus.REJECTED
    );
  }

  shouldFormSubmitBeDisabled(): boolean {
    return this.clientRegistrationFormGroup.value.status === this.data.status;
  }

  onSummit(): void {
    const newStatus = this.clientRegistrationFormGroup.value.status!;

    this.stateService
      .updateRegistrationStatusById(this.data.id, {
        id: this.data.id,
        noteFromTherapist:
          this.clientRegistrationFormGroup.value.noteFromTherapist ?? null,
        status: newStatus,
      })
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
}
