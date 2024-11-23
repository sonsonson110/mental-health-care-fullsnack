import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, forkJoin, tap } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import {
  addDays,
  addWeeks,
  endOfWeek,
  format,
  isSameWeek,
  isWithinInterval,
  startOfWeek,
} from 'date-fns';
import { CurrentClientResponse } from '../../../core/models/modules/manage-schedules/current-client-response.model';
import { TherapistsApiService } from '../../../core/api-services/therapists-api.service';
import { PrivateSessionSchedulesApiService } from '../../../core/api-services/private-session-schedules-api.service';
import { mapPrivateSessionScheduleToCalendarEvent } from '../../../core/mappers';
import { CreateUpdateScheduleRequest } from '../../../core/models/modules/manage-schedules/create-update-schedule-request.model';
import { PrivateSessionScheduleResponse } from '../../../core/models/modules/manage-schedules/therapist-schedule-response.model';

@Injectable()
export class ManageSessionsStateService {
  private loadingSubject = new BehaviorSubject<boolean>(true);
  readonly loading$ = this.loadingSubject.asObservable();

  private inlineCalendarDateSubject = new BehaviorSubject(new Date());
  readonly inlineCalendarDate$ = this.inlineCalendarDateSubject.asObservable();

  private currentClientSubject = new BehaviorSubject<CurrentClientResponse[]>([]);
  readonly currentClient$ = this.currentClientSubject.asObservable();

  private selectedRegistrationsSubject = new BehaviorSubject<string[]>([]);

  private eventsSubject = new BehaviorSubject<CalendarEvent[]>([]);
  readonly events$ = this.eventsSubject.asObservable();

  constructor(
    private therapistsApiService: TherapistsApiService,
    private privateSessionSchedulesApiService: PrivateSessionSchedulesApiService
  ) {}

  initData() {
    this.loadingSubject.next(true);

    forkJoin({
      clients: this.therapistsApiService.getCurrentClients(),
      // Get schedules for the current week when initializing
      schedules: this.fetchSchedulesForCurrentPeriod(),
    })
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: ({ clients, schedules }) => {
          this.currentClientSubject.next(clients);
          this.updateEvents(schedules);
        },
      });
  }

  private updateEvents(schedules: PrivateSessionScheduleResponse[]) {
    const events = schedules.map(mapPrivateSessionScheduleToCalendarEvent);
    this.eventsSubject.next(events);
  }

  private fetchSchedulesForCurrentPeriod() {
    const currentDate = this.inlineCalendarDateSubject.value;
    return this.privateSessionSchedulesApiService.getTherapistSchedules({
      startDate: format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
      endDate: format(addWeeks(currentDate, 1), 'yyyy-MM-dd'),
      privateRegistrationIds: this.selectedRegistrationsSubject.value,
    });
  }

  private loadEvents(startDate: string, endDate: string) {
    this.loadingSubject.next(true);

    this.privateSessionSchedulesApiService
      .getTherapistSchedules({
        startDate,
        endDate,
        privateRegistrationIds: this.selectedRegistrationsSubject.value,
      })
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe(schedules => this.updateEvents(schedules));
  }

  setInlineCalendarDate(date: Date, daysInWeek = 7): void {
    if (this.shouldFetchNewData(date, daysInWeek)) {
      const startDate =
        daysInWeek === 7
          ? format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')
          : format(date, 'yyyy-MM-dd');
      const endDate =
        daysInWeek === 7
          ? format(endOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')
          : format(addDays(date, daysInWeek - 1), 'yyyy-MM-dd');

      this.loadEvents(startDate, endDate);
    }
    this.inlineCalendarDateSubject.next(date);
  }

  private shouldFetchNewData(newDate: Date, daysInWeek: number): boolean {
    if (daysInWeek === 7) {
      return !isSameWeek(newDate, this.inlineCalendarDateSubject.value, {
        weekStartsOn: 1,
      });
    } else {
      const rangeEnd = addDays(this.inlineCalendarDateSubject.value, daysInWeek - 1);

      return !isWithinInterval(newDate, {
        start: this.inlineCalendarDateSubject.value,
        end: rangeEnd,
      });
    }
  }

  setSelectedRegistrations(registrations: string[]): void {
    this.selectedRegistrationsSubject.next(registrations);
    this.loadEvents(
      format(
        startOfWeek(this.inlineCalendarDateSubject.value, { weekStartsOn: 1 }),
        'yyyy-MM-dd'
      ),
      format(addWeeks(this.inlineCalendarDateSubject.value, 1), 'yyyy-MM-dd')
    );
  }

  submitSchedule(request: CreateUpdateScheduleRequest, mode: 'create' | 'update') {
    const req =
      mode === 'create'
        ? this.privateSessionSchedulesApiService.createSchedule(request)
        : this.privateSessionSchedulesApiService.updateSchedule(request);

    return req.pipe(
      tap(() =>
        this.loadEvents(
          format(
            startOfWeek(this.inlineCalendarDateSubject.value, { weekStartsOn: 1 }),
            'yyyy-MM-dd'
          ),
          format(addWeeks(this.inlineCalendarDateSubject.value, 1), 'yyyy-MM-dd')
        )
      )
    );
  }
}
