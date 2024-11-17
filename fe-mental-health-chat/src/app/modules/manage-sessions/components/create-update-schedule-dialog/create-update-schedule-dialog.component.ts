import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { addDays, format, isAfter, parse, setHours, setMinutes } from 'date-fns';
import { MatSelectModule } from '@angular/material/select';
import { ManageSessionsStateService } from '../../services/manage-sessions-state.service';
import { CurrentClientResponse } from '../../../../core/models/modules/manage-schedules/current-client-response.model';
import { Observable } from 'rxjs';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ParseAvatarUrlPipe } from '../../../../shared/pipes/parse-avatar-url.pipe';
import { CreateUpdateScheduleRequest } from '../../../../core/models/modules/manage-schedules/create-update-schedule-request.model';
import { ToastrService } from 'ngx-toastr';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatCheckboxModule
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
  readonly timeOptions: string[] = this.generateTimeOptions();

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
    { validators: this.validateTimeRange() }
  );

  constructor(
    private stateService: ManageSessionsStateService,
    private toastr: ToastrService
  ) {
    this.currentClients$ = stateService.currentClient$;
  }

  private validateTimeRange(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const startTime = formGroup.get('startTime')?.value;
      const endTime = formGroup.get('endTime')?.value;
      const baseDate = formGroup.get('date')?.value || new Date();

      if (startTime && endTime) {
        const startDateTime = parse(startTime, 'hh:mm a', baseDate);
        const endDateTime = parse(endTime, 'hh:mm a', baseDate);

        if (!isAfter(endDateTime, startDateTime)) {
          return { invalidTimeRange: true };
        }
      }

      return null;
    };
  }

  onSubmit() {
    if (this.scheduleFormGroup.valid) {
      const date = format(this.scheduleFormGroup.value.date!, 'yyyy-MM-dd');
      const startTime = this.convert12to24(this.scheduleFormGroup.value.startTime!);
      const endTime = this.convert12to24(this.scheduleFormGroup.value.endTime!);

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
        .subscribe(() => {
          this.toastr.success(`Schedule has been successfully ${this.mode}.`);
          this.dialogRef.close();
        });
    }
  }

  private convert12to24(time: string): string {
    return format(parse(time, 'hh:mm a', new Date()), 'HH:mm:ss');
  }

  private generateTimeOptions(): string[] {
    const times: string[] = [];
    for (let hour = 5; hour <= 22; hour++) {
      // Add hour mark
      times.push(format(setHours(setMinutes(new Date(), 0), hour), 'hh:mm a'));
      times.push(format(setHours(setMinutes(new Date(), 30), hour), 'hh:mm a'));
    }
    return times;
  }
}
