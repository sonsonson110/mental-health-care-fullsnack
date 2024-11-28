import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, forkJoin } from 'rxjs';
import { AvailableTemplateApiService } from '../../../core/api-services/available-template-api.service';
import { CalendarEvent } from 'angular-calendar';
import { startOfWeek } from 'date-fns';
import { mapAvailableTemplateItemsToCalendarEvents } from '../../../core/mappers';
import { CreateAvailabilityTemplateItem } from '../../../core/models/modules/manage-working-time/create-availability-template-items-request.model';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ManageAvailabilityTemplateStateService {
  private availabilityTemplateLoadingSubject = new BehaviorSubject<boolean>(false);
  readonly availabilityTemplateLoading$ =
    this.availabilityTemplateLoadingSubject.asObservable();

  private availabilityTemplateSubject = new BehaviorSubject<CalendarEvent[]>([]);
  readonly availabilityTemplate$ = this.availabilityTemplateSubject.asObservable();

  private pendingToAddWorkingTimeItemsSubject = new BehaviorSubject<
    CreateAvailabilityTemplateItem[]
  >([]);
  readonly pendingToAddWorkingTimeItems$ =
    this.pendingToAddWorkingTimeItemsSubject.asObservable();

  private pendingToDeleteWorkingTimeEventsSubject = new BehaviorSubject<CalendarEvent[]>(
    []
  );
  readonly pendingToDeleteWorkingTimeEvents$ =
    this.pendingToDeleteWorkingTimeEventsSubject.asObservable();

  constructor(
    private availabilityTemplateApiService: AvailableTemplateApiService,
    private toastr: ToastrService
  ) {}

  addPendingToDeleteWorkingTimeItem(event: CalendarEvent) {
    // add to pending list
    const pendingItems = [...this.pendingToDeleteWorkingTimeEventsSubject.value];
    if (pendingItems.some(item => item.id === event.id)) return;
    pendingItems.push(event);
    this.pendingToDeleteWorkingTimeEventsSubject.next(pendingItems);

    // remove from available list
    const availableItems = this.availabilityTemplateSubject.value.filter(item => item.id !== event.id);
    this.availabilityTemplateSubject.next(availableItems);
  }

  deletePendingToDeleteWorkingTimeItem(event: CalendarEvent) {
    // remove from pending list
    const pendingItems = this.pendingToDeleteWorkingTimeEventsSubject.value.filter(item => item.id !== event.id);
    this.pendingToDeleteWorkingTimeEventsSubject.next(pendingItems);

    // add back to available list
    const availableItems = [...this.availabilityTemplateSubject.value, event];
    this.availabilityTemplateSubject.next(availableItems);
  }

  addWorkingTimeItem(request: CreateAvailabilityTemplateItem) {
    let checkFlag = true;
    const pendingItems = this.pendingToAddWorkingTimeItemsSubject.value;
    pendingItems.forEach(item => {
      if (this.isOverlapping(request, item)) {
        checkFlag = false;
        return;
      }
    });
    if (!checkFlag) return;
    pendingItems.push(request);
    this.pendingToAddWorkingTimeItemsSubject.next(pendingItems);
  }

  private isOverlapping(
    request: CreateAvailabilityTemplateItem,
    item: CreateAvailabilityTemplateItem
  ) {
    if (request.dateOfWeek !== item.dateOfWeek) return false;

    if (request.startTime >= item.endTime || request.endTime <= item.startTime)
      return false;

    this.toastr.error('Working time items cannot overlap');
    return true;
  }

  deletePendingAddWorkingTimeItem(index: number) {
    const pendingItems = this.pendingToAddWorkingTimeItemsSubject.value;
    pendingItems.splice(index, 1);
    this.pendingToAddWorkingTimeItemsSubject.next(pendingItems);
  }

  loadAvailabilityTemplate() {
    this.availabilityTemplateLoadingSubject.next(true);
    this.availabilityTemplateApiService
      .getAvailableTemplateItems()
      .pipe(finalize(() => this.availabilityTemplateLoadingSubject.next(false)))
      .subscribe(data => {
        const weekDate = startOfWeek(new Date(), { weekStartsOn: 1 });
        const events = data.map(template => {
          return mapAvailableTemplateItemsToCalendarEvents(template, weekDate);
        });
        this.availabilityTemplateSubject.next(events);
      });
  }

  submitChanges() {
    const addItems = this.pendingToAddWorkingTimeItemsSubject.value;
    const deleteItems = this.pendingToDeleteWorkingTimeEventsSubject.value;

    if (addItems.length === 0 && deleteItems.length === 0) return;

    this.availabilityTemplateLoadingSubject.next(true);

    const observables = [];

    if (addItems.length > 0) {
      observables.push(
        this.availabilityTemplateApiService.createAvailableTemplateItems({
          items: addItems,
        })
      );
    }

    if (deleteItems.length > 0) {
      observables.push(
        this.availabilityTemplateApiService.deleteAvailableTemplateItems({
          itemIds: deleteItems.map(event => event.meta.id),
        })
      );
    }

    // Use forkJoin only with existing observables
    forkJoin(observables)
      .pipe(finalize(() => this.availabilityTemplateLoadingSubject.next(false)))
      .subscribe({
        next: () => {
          this.toastr.success('Working time items updated successfully');
          this.pendingToAddWorkingTimeItemsSubject.next([]);
          this.pendingToDeleteWorkingTimeEventsSubject.next([]);
          this.loadAvailabilityTemplate();
        },
        error: err => {
          this.toastr.error('Failed to update working time items');
          console.error(err);
        },
      });
  }
}
