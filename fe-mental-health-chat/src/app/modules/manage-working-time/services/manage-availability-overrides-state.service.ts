import { Injectable } from '@angular/core';
import { AvailabilityOverridesApiService } from '../../../core/api-services/availability-overrides-api.service';
import { BehaviorSubject, finalize } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { mapAvailabilityOverrideToCalendarEvent } from '../../../core/mappers';
import { addDays, format } from 'date-fns';
import { CreateUpdateAvailabilityOverrideRequest } from '../../../core/models/modules/manage-working-time/create-update-availability-override-request.model';

@Injectable()
export class ManageAvailabilityOverridesStateService {
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  private readonly eventsSubject = new BehaviorSubject<CalendarEvent[]>([]);
  readonly events$ = this.eventsSubject.asObservable();

  private readonly viewDate = new BehaviorSubject(new Date());
  readonly viewDate$ = this.viewDate.asObservable();

  constructor(private apiService: AvailabilityOverridesApiService) {}

  loadAvailabilityOverrides(daysInWeek = 7) {
    this.loadingSubject.next(true);

    const startDate = format(this.viewDate.value, 'yyyy-MM-dd');
    const endDate = format(addDays(this.viewDate.value, daysInWeek - 1), 'yyyy-MM-dd');

    this.apiService
      .getAvailabilityOverrides({ startDate, endDate })
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe(overrides => {
        const events = overrides.map(mapAvailabilityOverrideToCalendarEvent);
        this.eventsSubject.next(events);
      });
  }

  setViewDate(date = this.viewDate.value, daysInWeek = 7) {
    this.viewDate.next(date);
    this.loadAvailabilityOverrides(daysInWeek);
  }

  submitOverride(
    data: CreateUpdateAvailabilityOverrideRequest,
    mode: 'create' | 'update'
  ) {
    return mode === 'create'
      ? this.apiService.createAvailabilityOverride(data)
      : this.apiService.updateAvailabilityOverride(data);
  }

  deleteOverride(id: string) {
    return this.apiService.deleteAvailabilityOverride(id);
  }
}
