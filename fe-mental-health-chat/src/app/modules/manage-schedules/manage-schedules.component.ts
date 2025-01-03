import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { CalendarEvent, CalendarModule } from 'angular-calendar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { addDays, format, isSameMonth, isSameYear, parse, startOfWeek } from 'date-fns';
import { Observable, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ManageSessionsStateService } from './services/manage-sessions-state.service';
import { CurrentClientResponse } from '../../core/models/modules/manage-schedules/current-client-response.model';
import { CreateUpdateScheduleDialogComponent } from './components/create-update-schedule-dialog/create-update-schedule-dialog.component';
import { CreateUpdateScheduleRequest } from '../../core/models/modules/manage-schedules/create-update-schedule-request.model';

@Component({
  selector: 'app-manage-sessions',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    CommonModule,
    MatToolbarModule,
    FormsModule,
    MatIconModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatListModule,
    CalendarModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ManageSessionsStateService, MatDialogModule],
  templateUrl: './manage-schedules.component.html',
  styleUrl: './manage-schedules.component.scss',
})
export class ManageSchedulesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('calendar', { static: false }) calendar!: MatCalendar<Date>;

  isSidenavOpen = true;
  sidenavMode: 'side' | 'over' = 'side';

  loading$: Observable<boolean>;
  inlineCalendarDate = new Date();
  currentClient$: Observable<CurrentClientResponse[]>;
  events$: Observable<CalendarEvent[]>;

  selectedRegistrationControl = new FormControl([] as string[]);
  viewDate: Date = startOfWeek(new Date(), { weekStartsOn: 1 });
  daysInWeek = 7;

  constructor(
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    private breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef,
    private stateService: ManageSessionsStateService,
    private dialog: MatDialog,
    private viewContainerRef: ViewContainerRef
  ) {
    matIconRegistry.addSvgIcon(
      'side_navigation',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/side-navigation.svg')
    );

    this.initializeCalendarState();

    this.stateService.inlineCalendarDate$.subscribe(
      date => (this.inlineCalendarDate = date)
    );
    this.events$ = this.stateService.events$;
    this.loading$ = this.stateService.loading$;
    this.currentClient$ = this.stateService.currentClient$;
  }

  ngOnInit() {
    this.stateService.initData();

    this.calculateCalendarResponsiveness();

    this.stateService.inlineCalendarDate$.subscribe(date => {
      this.updateViewDate(date);
    });

    this.selectedRegistrationControl.valueChanges.subscribe(value => {
      if (!value || value.length === 0) return;
      this.stateService.setSelectedRegistrations(value);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private calculateCalendarResponsiveness() {
    this.breakpointObserver
      .observe(
        Object.values(this.CALENDAR_RESPONSIVE).map(({ breakpoint }) => breakpoint)
      )
      .pipe(takeUntil(this.destroy$))
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

    this.breakpointObserver
      .observe('(min-width: 768px)')
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isSidenavOpen = result.matches;
        this.sidenavMode = result.matches ? 'side' : 'over';
      });
  }

  private initializeCalendarState() {
    // Check current screen size and set initial daysInWeek
    const currentBreakpoint = Object.values(this.CALENDAR_RESPONSIVE).find(
      ({ breakpoint }) => this.breakpointObserver.isMatched(breakpoint)
    );

    this.daysInWeek = currentBreakpoint ? currentBreakpoint.daysInWeek : 7;
    this.updateViewDate(new Date());
  }

  private updateViewDate(date: Date) {
    this.viewDate = this.daysInWeek === 7 ? startOfWeek(date, { weekStartsOn: 1 }) : date;
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
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

  onTodayClick() {
    const today = new Date();
    this.stateService.setInlineCalendarDate(today, this.daysInWeek);
    this.calendar._goToDateInView(today, 'month');
  }

  onCreateScheduleClick() {
    this.openEditScheduleDialog({
      date: format(this.inlineCalendarDate, 'yyyy-MM-dd'),
      startTime: format(this.inlineCalendarDate, 'hh:mm a'),
    });
  }

  onInlineDateSelected(date: Date | null) {
    if (!date) return;
    this.stateService.setInlineCalendarDate(date, this.daysInWeek);
  }

  onEventClick(event: CalendarEvent) {
    const startTime = parse(event.meta.startTime, 'HH:mm:ss', new Date());
    const endTime = parse(event.meta.endTime, 'HH:mm:ss', new Date());

    this.openEditScheduleDialog({
      id: event.meta.id,
      privateSessionRegistrationId: event.meta?.privateSessionRegistrationId,
      date: event.meta.date,
      startTime: format(startTime, 'hh:mm a'),
      endTime: format(endTime, 'hh:mm a'),
      noteFromTherapist: event.meta?.noteFromTherapist,
      isCancelled: event.meta?.isCancelled,
    });
  }

  onWeekCalendarClick(date: Date) {
    this.openEditScheduleDialog({
      date: format(date, 'yyyy-MM-dd'),
      startTime: format(date, 'hh:mm a'),
    });
  }

  onRefreshClick() {
    this.stateService.initData();
  }

  private openEditScheduleDialog(request?: CreateUpdateScheduleRequest) {
    this.dialog.open(CreateUpdateScheduleDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      maxWidth: '992px',
      data: {
        id: request?.id,
        privateSessionRegistrationId: request?.privateSessionRegistrationId,
        date: request?.date, // yyyy-MM-dd
        startTime: request?.startTime, // hh:mm a
        endTime: request?.endTime, // hh:mm a
        noteFromTherapist: request?.noteFromTherapist,
        isCancelled: request?.isCancelled,
      },
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
