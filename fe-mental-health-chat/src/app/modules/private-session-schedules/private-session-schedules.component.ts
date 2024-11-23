import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CalendarEvent, CalendarModule } from 'angular-calendar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PrivateSessionSchedulesStateService } from './services/private-session-schedules-state.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { addDays, format, isSameMonth, isSameYear, startOfWeek } from 'date-fns';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Observable, takeUntil } from 'rxjs';
import { TherapistRegistrationResponse } from '../../core/models/therapist-registration-response.model';
import { ParseAvatarUrlPipe } from '../../shared/pipes/parse-avatar-url.pipe';
import { PrivateSessionRegistrationStatus } from '../../core/models/enums/private-session-registration-status.enum';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-private-session-schedules',
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
  providers: [PrivateSessionSchedulesStateService],
  templateUrl: './private-session-schedules.component.html',
  styleUrl: './private-session-schedules.component.scss',
})
export class PrivateSessionSchedulesComponent implements OnInit {
  viewDate: Date = new Date();
  daysInWeek = 7;

  events: CalendarEvent[] = [];
  loading$: Observable<boolean>;
  currentRegistration$: Observable<TherapistRegistrationResponse | null>;

  constructor(
    private stateService: PrivateSessionSchedulesStateService,
    private breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef,
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
    this.stateService.setInlineCalendarDate(addDays(this.viewDate, -this.daysInWeek), this.daysInWeek);
  }

  onNextWeekClick() {
    this.stateService.setInlineCalendarDate(addDays(this.viewDate, this.daysInWeek), this.daysInWeek);
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
}
