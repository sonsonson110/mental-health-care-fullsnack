import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, forkJoin } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import {
  PrivateSessionRegistrationsApiService,
} from '../../../core/api-services/private-session-registrations-api.service';
import { PrivateSessionSchedulesApiService } from '../../../core/api-services/private-session-schedules-api.service';
import { mapPrivateSessionScheduleToCalendarEvent } from '../../../core/mappers';
import {
  PrivateSessionScheduleResponse,
} from '../../../core/models/modules/manage-schedules/therapist-schedule-response.model';
import { TherapistRegistrationResponse } from '../../../core/models/common/therapist-registration-response.model';
import { addDays, format } from 'date-fns';

@Injectable()
export class PrivateSessionSchedulesStateService {
  private loadingStateSubject = new BehaviorSubject(false);
  readonly loadingState$ = this.loadingStateSubject.asObservable();

  private currentViewDateSubject = new BehaviorSubject(new Date());
  readonly currentViewDate$ = this.currentViewDateSubject.asObservable();

  private eventsSubject = new BehaviorSubject<CalendarEvent[]>([]);
  readonly events$ = this.eventsSubject.asObservable();

  private currentRegistrationSubject =
    new BehaviorSubject<TherapistRegistrationResponse | null>(null);
  readonly currentRegistration$ = this.currentRegistrationSubject.asObservable();

  constructor(
    private privateSessionRegistrationApiService: PrivateSessionRegistrationsApiService,
    private privateSessionSchedulesApiService: PrivateSessionSchedulesApiService,
  ) {
  }

  initData(daysInWeek = 7) {
    forkJoin({
      currentTherapistRegistration:
        this.privateSessionRegistrationApiService.getClientCurrentTherapist(),
      schedules: this.loadClientSchedule(daysInWeek),
    }).subscribe({
      next: ({ currentTherapistRegistration, schedules }) => {
        this.currentRegistrationSubject.next(currentTherapistRegistration);
        this.updateEvents(schedules);
      },
    });
  }

  setInlineCalendarDate(date = this.currentViewDateSubject.value, daysInWeek = 7) {
    this.currentViewDateSubject.next(date);
    this.loadClientSchedule(daysInWeek).subscribe({
      next: schedules => this.updateEvents(schedules),
    });
  }

  private updateEvents(schedules: PrivateSessionScheduleResponse[]) {
    const events = schedules.map(e => {
      const event = mapPrivateSessionScheduleToCalendarEvent(e);
      event.title = `${event.meta.startTime} - ${event.meta.endTime}: ${event.meta.noteFromTherapist}`;
      return event;
    });
    this.eventsSubject.next(events);
  }

  private loadClientSchedule(daysInWeek = 7) {
    this.loadingStateSubject.next(true);
    const startDate = format(this.currentViewDateSubject.value, 'yyyy-MM-dd');
    const endDate = format(addDays(startDate, daysInWeek - 1), 'yyyy-MM-dd');
    return this.privateSessionSchedulesApiService
      .getClientSchedules({
        startDate,
        endDate,
      })
      .pipe(finalize(() => this.loadingStateSubject.next(false)));
  }
}
