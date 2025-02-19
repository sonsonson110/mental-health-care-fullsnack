import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CalendarEvent, CalendarModule } from 'angular-calendar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MySchedulesStateService } from './services/my-schedules-state.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { addDays, format, isSameMonth, isSameYear } from 'date-fns';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Observable } from 'rxjs';
import { TherapistRegistrationResponse } from '../../core/models/common/therapist-registration-response.model';
import { ParseAvatarUrlPipe } from '../../shared/pipes/parse-avatar-url.pipe';
import { PrivateSessionRegistrationStatus } from '../../core/models/enums/private-session-registration-status.enum';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import {
  PrivateSessionScheduleViewDialogComponent
} from './components/private-session-schedule-view-dialog/private-session-schedule-view-dialog.component';

@Component({
  selector: 'app-my-schedules',
  standalone: true,
  imports: [
    MatDialogModule,
    CalendarModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressBarModule,
    CommonModule,
    NgOptimizedImage,
    ParseAvatarUrlPipe,
  ],
  providers: [MySchedulesStateService],
  templateUrl: './my-schedules.component.html',
  styleUrl: './my-schedules.component.scss',
})
export class MySchedulesComponent implements OnInit {
  viewDate: Date = new Date();
  daysInWeek = 7;

  events: CalendarEvent[] = [];
  loading$: Observable<boolean>;
  currentRegistration$: Observable<TherapistRegistrationResponse | null>;

  constructor(
    private stateService: MySchedulesStateService,
    private breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.stateService.events$.subscribe(events => (this.events = events));
    this.loading$ = stateService.loadingState$;
    this.currentRegistration$ = stateService.currentRegistration$;
    this.stateService.currentViewDate$.subscribe(date => (this.viewDate = date));
  }

  ngOnInit(): void {
    this.calculateCalendarResponsiveness();
    this.stateService.initData(this.daysInWeek);
  }

  onPreviousWeekClick() {
    this.stateService.setInlineCalendarDate(
      addDays(this.viewDate, -this.daysInWeek),
      this.daysInWeek
    );
  }

  onNextWeekClick() {
    this.stateService.setInlineCalendarDate(
      addDays(this.viewDate, this.daysInWeek),
      this.daysInWeek
    );
  }

  onRefreshClick() {
    this.stateService.initData(this.daysInWeek);
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

  protected readonly PrivateSessionRegistrationStatus = PrivateSessionRegistrationStatus;

  onEventClicked(event: CalendarEvent) {
    if (event.meta?.type === 'public') {
      this.router.navigate(['/public-sessions', event.meta.publicSessionId]);
    } else {
      this.dialog.open(PrivateSessionScheduleViewDialogComponent, {
        minWidth: '490px',
        maxWidth: '992px',
        data: event.meta,
      });
    }
  }
}
