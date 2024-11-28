import { ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { ManageAvailabilityOverridesStateService } from '../../services/manage-availability-overrides-state.service';
import { CalendarEvent, CalendarModule } from 'angular-calendar';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { addDays, format, isSameMonth, isSameYear, parse } from 'date-fns';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  CreateUpdateAvailabilityOverrideRequest
} from '../../../../core/models/modules/manage-working-time/create-update-availability-override-request.model';
import { MatDialog } from '@angular/material/dialog';
import {
  CreateUpdateAvailabilityOverrideDialogComponent
} from '../create-update-availablility-override-dialog/create-update-availability-override-dialog.component';

@Component({
  selector: 'app-manage-availability-overrides',
  standalone: true,
  imports: [
    CalendarModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './manage-availability-overrides.component.html',
  styleUrl: './manage-availability-overrides.component.scss',
})
export class ManageAvailabilityOverridesComponent implements OnInit {
  loading$: Observable<boolean>;

  daysInWeek = 7;
  events: CalendarEvent[] = [];
  viewDate: Date = new Date();
  selectedDateFormControl = new FormControl(this.viewDate);

  constructor(
    private stateService: ManageAvailabilityOverridesStateService,
    private breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef,
    private matDialog: MatDialog,
    private viewContainerRef: ViewContainerRef
  ) {
    this.loading$ = stateService.loading$;
    this.stateService.events$.subscribe(events => (this.events = events));
    this.stateService.viewDate$.subscribe(viewDate => (this.viewDate = viewDate));
  }

  ngOnInit(): void {
    this.calculateCalendarResponsiveness();
    this.stateService.loadAvailabilityOverrides(this.daysInWeek);
    this.selectedDateFormControl.valueChanges.subscribe(date => {
      this.stateService.setViewDate(date ?? this.viewDate, this.daysInWeek);
    });
  }

  onPreviousWeekClick() {
    this.stateService.setViewDate(
      addDays(this.viewDate, -this.daysInWeek),
      this.daysInWeek
    );
  }

  onNextWeekClick() {
    this.stateService.setViewDate(
      addDays(this.viewDate, this.daysInWeek),
      this.daysInWeek
    );
  }

  onHourSegmentClick(date: Date) {
    this.openDialog({
      date: format(date, 'yyyy-MM-dd'),
      startTime: format(date, 'hh:mm a'),
    })
  }

  onEventClick(event: CalendarEvent) {
    const startTime = parse(event.meta.startTime, 'HH:mm:ss', new Date());
    const endTime = parse(event.meta.endTime, 'HH:mm:ss', new Date());

    this.openDialog({
      id: event.meta.id,
      date: format(event.start, 'yyyy-MM-dd'),
      startTime: format(startTime, 'hh:mm a'),
      endTime: format(endTime, 'hh:mm a'),
      isAvailable: event.meta.isAvailable,
      description: event.meta.description,
    });
  }

  private openDialog(data: CreateUpdateAvailabilityOverrideRequest) {
    this.matDialog.open(CreateUpdateAvailabilityOverrideDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      data: data,
      maxWidth: '992px'
    })
  }

  onRefreshClick() {
    this.stateService.setViewDate(this.viewDate, this.daysInWeek);
  }

  get timeRangeDisplay(): string {
    if (!this.viewDate) return '';

    const start = this.viewDate;
    const end = addDays(start, this.daysInWeek - 1);

    // If start and end are in the same month
    if (isSameMonth(start, end)) {
      return `${format(start, 'MMMM d')} - ${format(end, 'd, yyyy')}`;
    }

    // If start and end are in different months but same year
    if (isSameYear(start, end)) {
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }

    // If start and end are in different years
    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
  }

  private calculateCalendarResponsiveness() {
    this.breakpointObserver
      .observe(
        Object.values(this.CALENDAR_RESPONSIVE).map(({ breakpoint }) => breakpoint)
      )
      .subscribe((state: BreakpointState) => {
        const foundBreakpoint = Object.values(this.CALENDAR_RESPONSIVE).find(
          ({ breakpoint }) => !!state.breakpoints[breakpoint]
        );
        if (foundBreakpoint) {
          this.daysInWeek = foundBreakpoint.daysInWeek;
        } else {
          this.daysInWeek = 7;
        }
        this.cd.markForCheck();
      });
  }

  // const
  private readonly CALENDAR_RESPONSIVE = {
    small: {
      breakpoint: '(max-width: 490px)',
      daysInWeek: 2,
    },
    medium: {
      breakpoint: '(max-width: 768px)',
      daysInWeek: 3,
    },
    large: {
      breakpoint: '(max-width: 992px)',
      daysInWeek: 5,
    },
  };
}
