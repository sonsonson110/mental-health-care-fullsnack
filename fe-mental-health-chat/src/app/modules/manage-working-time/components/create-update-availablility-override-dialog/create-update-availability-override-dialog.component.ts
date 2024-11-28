import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { validateTimeRange } from '../../../../shared/validators/time-range.validator';
import { ToastrService } from 'ngx-toastr';
import { format } from 'date-fns';
import { convert12to24 } from '../../../../shared/utils/date-parse';
import { finalize } from 'rxjs';
import { generateTimeOptions } from '../../../../shared/utils/generate-time-options';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CreateUpdateAvailabilityOverrideRequest } from '../../../../core/models/modules/manage-working-time/create-update-availability-override-request.model';
import { ManageAvailabilityOverridesStateService } from '../../services/manage-availability-overrides-state.service';

@Component({
  selector: 'app-create-update-availability-override-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCheckboxModule,
    CommonModule,
    MatDatepickerModule,
  ],
  templateUrl: './create-update-availability-override-dialog.component.html',
  styleUrl: './create-update-availability-override-dialog.component.scss',
})
export class CreateUpdateAvailabilityOverrideDialogComponent {
  readonly dialogRef = inject(
    MatDialogRef<CreateUpdateAvailabilityOverrideDialogComponent>
  );
  readonly data: CreateUpdateAvailabilityOverrideRequest = inject(MAT_DIALOG_DATA);

  readonly mode = this.data.id ? 'update' : 'create';
  readonly capitalizedMode = this.mode.charAt(0).toUpperCase() + this.mode.slice(1);

  // Create array of time options from 5 AM to 12 AM
  readonly timeOptions: string[] = generateTimeOptions();

  isSubmitting = false;

  availabilityFormGroup = new FormGroup(
    {
      date: new FormControl(this.parseDate(this.data.date!), [Validators.required]),
      startTime: new FormControl<string>(this.data.startTime!, [Validators.required]),
      endTime: new FormControl(this.data.endTime ?? '', [Validators.required]),
      description: new FormControl(this.data.description ?? ''),
      isAvailable: new FormControl(this.data.isAvailable ?? true),
    },
    { validators: validateTimeRange() }
  );

  constructor(
    private toastr: ToastrService,
    private stateService: ManageAvailabilityOverridesStateService
  ) {}

  private parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  onSubmit() {
    if (this.availabilityFormGroup.valid) {
      this.isSubmitting = true;

      const date = format(this.availabilityFormGroup.value.date!, 'yyyy-MM-dd');
      const startTime = convert12to24(this.availabilityFormGroup.value.startTime!);
      const endTime = convert12to24(this.availabilityFormGroup.value.endTime!);

      const submitData = {
        ...this.availabilityFormGroup.getRawValue(),
        id: this.data.id,
        date,
        startTime,
        endTime,
      };

      // Replace this with your actual service method
      this.stateService
        .submitOverride(submitData, this.mode)
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: () => {
            this.toastr.success(`Availability has been successfully ${this.mode}d.`);
            this.stateService.setViewDate();
            this.dialogRef.close(submitData);
          },
        });
    }
  }

  deleteOverride() {
    this.stateService.deleteOverride(this.data.id!).subscribe(() => {
      this.toastr.success('Availability has been successfully deleted.');
      this.stateService.setViewDate();
      this.dialogRef.close();
    });
  }
}
