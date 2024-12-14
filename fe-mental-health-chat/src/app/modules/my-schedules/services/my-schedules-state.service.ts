import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, forkJoin } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { PrivateSessionRegistrationsApiService } from '../../../core/api-services/private-session-registrations-api.service';
import { PrivateSessionSchedulesApiService } from '../../../core/api-services/private-session-schedules-api.service';
import {
  mapCalendarFollowedPublicSessionResponseToCalendarEvent,
  mapPrivateSessionScheduleToCalendarEvent,
} from '../../../core/mappers';
import { TherapistRegistrationResponse } from '../../../core/models/common/therapist-registration-response.model';
import { addDays, format } from 'date-fns';
import { PublicSessionsApiService } from '../../../core/api-services/public-sessions-api.service';
import { CalendarFollowedPublicSessionResponse } from '../../../core/models/modules/manage-schedules/calendar-followed-public-session-response.model';
import { PrivateSessionScheduleResponse } from '../../../core/models/modules/manage-schedules/therapist-schedule-response.model';

@Injectable()
export class MySchedulesStateService {
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
    private publicSessionsApiService: PublicSessionsApiService
  ) {}

  initData(daysInWeek = 7) {
    forkJoin({
      currentTherapistRegistration:
        this.privateSessionRegistrationApiService.getClientCurrentTherapist(),
      sessions: this.loadClientSchedule(daysInWeek),
    }).subscribe({
      next: ({ currentTherapistRegistration, sessions }) => {
        this.currentRegistrationSubject.next(currentTherapistRegistration);
        this.updateEvents(sessions.privateSessions, sessions.publicSessions);
      },
    });
  }

  private updateEvents(
    privateSessions: PrivateSessionScheduleResponse[],
    publicSessions: CalendarFollowedPublicSessionResponse[]
  ) {
    const privateSessionsEvents = privateSessions.map(e => {
      const event = mapPrivateSessionScheduleToCalendarEvent(e);
      event.title = `${event.meta.startTime} - ${event.meta.endTime}: ${event.meta.noteFromTherapist}`;
      return event;
    });
    const publicSessionEvents = publicSessions.map(
      mapCalendarFollowedPublicSessionResponseToCalendarEvent
    );
    this.eventsSubject.next([...privateSessionsEvents, ...publicSessionEvents]);
  }

  setInlineCalendarDate(date = this.currentViewDateSubject.value, daysInWeek = 7) {
    this.currentViewDateSubject.next(date);
    this.loadClientSchedule(daysInWeek).subscribe({
      next: ({ privateSessions, publicSessions }) => {
        this.updateEvents(privateSessions, publicSessions);
      },
    });
  }

  private loadClientSchedule(daysInWeek = 7) {
    this.loadingStateSubject.next(true);
    const startDate = format(this.currentViewDateSubject.value, 'yyyy-MM-dd');
    const endDate = format(addDays(startDate, daysInWeek - 1), 'yyyy-MM-dd');
    const requestObj = {
      startDate,
      endDate,
    };

    return forkJoin({
      privateSessions:
        this.privateSessionSchedulesApiService.getClientSchedules(requestObj),
      publicSessions:
        this.publicSessionsApiService.getCalendarFollowedPublicSessions(requestObj),
    }).pipe(finalize(() => this.loadingStateSubject.next(false)));
  }
}
