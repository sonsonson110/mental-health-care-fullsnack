import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { format } from 'date-fns';
import { MatSelectModule } from '@angular/material/select';
import { ManageSessionsStateService } from '../../services/manage-sessions-state.service';
import { CurrentClientResponse } from '../../../../core/models/modules/manage-schedules/current-client-response.model';
import { finalize, Observable } from 'rxjs';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ParseAvatarUrlPipe } from '../../../../shared/pipes/parse-avatar-url.pipe';
import { CreateUpdateScheduleRequest } from '../../../../core/models/modules/manage-schedules/create-update-schedule-request.model';
import { ToastrService } from 'ngx-toastr';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { validateTimeRange } from '../../../../shared/validators/time-range.validator';
import { convert12to24 } from '../../../../shared/utils/date-parse';
import { generateTimeOptions } from '../../../../shared/utils/generate-time-options';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-create-update-schedule-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule,
    MatDatepickerModule,
    ParseAvatarUrlPipe,
    NgOptimizedImage,
    MatCheckboxModule,
    MatProgressSpinner,
  ],
  templateUrl: './create-update-schedule-dialog.component.html',
  styleUrl: './create-update-schedule-dialog.component.scss',
})
export class CreateUpdateScheduleDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CreateUpdateScheduleDialogComponent>);
  readonly data: CreateUpdateScheduleRequest | null = inject(MAT_DIALOG_DATA);

  readonly mode = this.data?.id ? 'update' : 'create';
  readonly capitalizedMode = this.mode.charAt(0).toUpperCase() + this.mode.slice(1);
  readonly formFieldAppearance = this.mode === 'create' ? 'fill' : 'outline';

  currentClients$: Observable<CurrentClientResponse[]>;

  // Create array of time options from 5 AM to 12 AM
  readonly timeOptions: string[] = generateTimeOptions();

  isSubmitting = false;

  scheduleFormGroup = new FormGroup(
    {
      privateSessionRegistrationId: new FormControl(
        {
          value: this.data?.privateSessionRegistrationId,
          disabled: this.mode === 'update',
        },
        [Validators.required]
      ),
      date: new FormControl(this.data?.date, [Validators.required]),
      startTime: new FormControl(this.data?.startTime ?? '', [Validators.required]),
      endTime: new FormControl(this.data?.endTime ?? '', [Validators.required]),
      noteFromTherapist: new FormControl(
        this.data?.noteFromTherapist,
        Validators.maxLength(255)
      ),
      isCancelled: new FormControl(this.data?.isCancelled),
    },
    { validators: validateTimeRange() }
  );

  constructor(
    private stateService: ManageSessionsStateService,
    private toastr: ToastrService
  ) {
    this.currentClients$ = stateService.currentClient$;
  }

  onSubmit() {
    if (this.scheduleFormGroup.valid) {
      this.isSubmitting = true;

      const date = format(this.scheduleFormGroup.value.date!, 'yyyy-MM-dd');
      const startTime = convert12to24(this.scheduleFormGroup.value.startTime!);
      const endTime = convert12to24(this.scheduleFormGroup.value.endTime!);

      this.stateService
        .submitSchedule(
          {
            id: this.data?.id,
            privateSessionRegistrationId:
              this.mode === 'create'
                ? this.scheduleFormGroup.value.privateSessionRegistrationId! // disabled form control leads to undefined value for updating
                : this.data!.privateSessionRegistrationId,
            date,
            startTime,
            endTime,
            noteFromTherapist: this.scheduleFormGroup.value.noteFromTherapist,
            isCancelled: this.scheduleFormGroup.value.isCancelled ?? false,
          },
          this.mode
        )
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe(() => {
          this.toastr.success(`Schedule has been successfully ${this.mode}.`);
          this.dialogRef.close();
        });
    }
  }
}
