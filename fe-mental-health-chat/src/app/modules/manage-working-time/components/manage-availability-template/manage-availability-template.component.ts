import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ManageAvailabilityTemplateStateService } from '../../services/manage-availability-template-state.service';
import { Observable } from 'rxjs';
import { CalendarEvent, CalendarModule } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { datesOfWeek } from '../../../../core/constants/dates-of-week.constant';
import { DateOfWeek } from '../../../../core/models/enums/date-of-week.enum';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CreateAvailabilityTemplateItem } from '../../../../core/models/modules/manage-working-time/create-availability-template-items-request.model';
import { MatListModule } from '@angular/material/list';
import { DateOffWeekPipe } from '../../../../shared/pipes/date-off-week.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-manage-availability-template',
  standalone: true,
  imports: [
    CalendarModule,
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    DateOffWeekPipe,
    MatIconModule,
  ],
  templateUrl: './manage-availability-template.component.html',
  styleUrl: './manage-availability-template.component.scss',
})
export class ManageAvailabilityTemplateComponent implements OnInit {
  loading$: Observable<boolean>;
  events: CalendarEvent[] = [];
  pendingToAddWorkingTimeItems$: Observable<CreateAvailabilityTemplateItem[]>;
  pendingToDeleteEvents: Observable<CalendarEvent[]>;
  viewDate: Date = new Date();

  addWorkingTimeFormGroup = new FormGroup(
    {
      dateOfWeek: new FormControl<DateOfWeek>(datesOfWeek[0].key, Validators.required),
      startTime: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(5),
        Validators.max(21),
      ]),
      endTime: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(6),
        Validators.max(22),
      ]),
    },
    { validators: this.startEndTimeValidator() }
  );

  constructor(
    private stateService: ManageAvailabilityTemplateStateService,
  ) {
    this.pendingToAddWorkingTimeItems$ = this.stateService.pendingToAddWorkingTimeItems$;
    this.pendingToDeleteEvents = this.stateService.pendingToDeleteWorkingTimeEvents$;
    this.loading$ = this.stateService.availabilityTemplateLoading$;
    this.stateService.availabilityTemplate$.subscribe(events => {
      this.events = events;
    });
  }

  ngOnInit(): void {
    this.stateService.loadAvailabilityTemplate();
  }

  startEndTimeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startTime = control.get('startTime')?.value;
      const endTime = control.get('endTime')?.value;

      return startTime !== null && endTime !== null && startTime >= endTime
        ? { startEndTimeInvalid: true }
        : null;
    };
  }

  onAddWorkingTime() {
    if (this.addWorkingTimeFormGroup.valid) {
      this.stateService.addWorkingTimeItem({
        dateOfWeek: this.addWorkingTimeFormGroup.controls.dateOfWeek.value!,
        startTime: this.addWorkingTimeFormGroup.controls.startTime.value!,
        endTime: this.addWorkingTimeFormGroup.controls.endTime.value!,
      });
      this.addWorkingTimeFormGroup.patchValue({
        dateOfWeek: datesOfWeek[0].key,
        startTime: null,
        endTime: null,
      });
    }
  }

  onDeletePendingAddWorkingTimeItem(index: number) {
    this.stateService.deletePendingAddWorkingTimeItem(index);
  }

  onEventClick(event: CalendarEvent) {
    this.stateService.addPendingToDeleteWorkingTimeItem(event);
  }

  onDeletePendingToDeleteWorkingTimeItem(event: CalendarEvent) {
    this.stateService.deletePendingToDeleteWorkingTimeItem(event);
  }

  onSubmit() {
    this.stateService.submitChanges();
  }

  protected readonly datesOfWeek = datesOfWeek;
}
