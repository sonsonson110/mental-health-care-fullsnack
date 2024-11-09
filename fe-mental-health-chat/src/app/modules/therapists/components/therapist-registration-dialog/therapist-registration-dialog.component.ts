import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PrivateSessionRegistrationsApiService } from '../../../../core/api-services/private-session-registrations-api.service';

@Component({
  selector: 'app-therapist-registration-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatCard,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './therapist-registration-dialog.component.html',
  styleUrl: './therapist-registration-dialog.component.scss',
})
export class TherapistRegistrationDialogComponent {
  data: DialogData = inject(MAT_DIALOG_DATA);
  messageFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(300),
  ]);

  constructor(
    private toastr: ToastrService,
    private privateSessionRegistrationsApiService: PrivateSessionRegistrationsApiService,
    public dialogRef: MatDialogRef<TherapistRegistrationDialogComponent>
  ) {}

  get getMessageLength(): number {
    return this.messageFormControl.getRawValue()?.length ?? 0;
  }

  onRegisterClick() {
    if (this.messageFormControl.valid) {
      this.privateSessionRegistrationsApiService
        .registerPrivateSession({
          therapistId: this.data.therapistId,
          noteFromClient: this.messageFormControl.value!,
        })
        .subscribe({
          next: () => {
            this.toastr.success('Private session registered successfully');
            this.dialogRef.close(true);
          },
        });
    }
  }
}

interface DialogData {
  therapistFullName: string;
  therapistId: string;
}
