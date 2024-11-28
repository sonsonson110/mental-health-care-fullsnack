import {
  PrivateSessionScheduleResponse,
} from './models/modules/manage-schedules/therapist-schedule-response.model';
import { CalendarEvent } from 'angular-calendar';
import { PublicSessionSummaryResponse } from './models/common/public-session-summary-response.model';
import {
  CreateUpdatePublicSessionRequest,
} from './models/modules/my-public-session/create-update-public-session-request.model';
import {
  TherapistAvailabilityTemplateResponse
} from './models/common/therapist-availability-template-response.model';
import { addDays, setHours } from 'date-fns';
import {
  AvailabilityOverrideResponse
} from './models/modules/manage-working-time/availability-override-response.model';

export function mapPrivateSessionScheduleToCalendarEvent(
  schedule: PrivateSessionScheduleResponse,
): CalendarEvent {
  const startDateTime = new Date(`${schedule.date}T${schedule.startTime}`);
  const endDateTime = new Date(`${schedule.date}T${schedule.endTime}`);

  // Define different styles based on session status
  const getEventStyle = (schedule: PrivateSessionScheduleResponse) => {
    if (schedule.isCancelled) {
      return {
        primary: '#ff4444',
        secondary: '#ffeeee',
      };
    }
    // Check if session is in the past
    if (endDateTime < new Date()) {
      return {
        primary: '#808080',
        secondary: '#e6e6e6',
      };
    }
    // Active upcoming session
    return {
      primary: '#1e90ff',
      secondary: '#d1e8ff',
    };
  };

  return {
    id: schedule.id,
    start: startDateTime,
    end: endDateTime,
    title: `Session with ${schedule.client?.fullName}`,
    color: getEventStyle(schedule),
    meta: schedule,
    draggable: false,
    resizable: {
      beforeStart: false,
      afterEnd: false,
    },
  };
}

export function mapAvailableTemplateItemsToCalendarEvents(
  template: TherapistAvailabilityTemplateResponse,
  weekStart: Date
): CalendarEvent {
  const startHour = Number(template.startTime.split(':')[0]);
  const endHour= Number(template.endTime.split(':')[0]);

  const dayDate = addDays(weekStart, template.dateOfWeek);

  // Set the hours and minutes for start and end
  const start = setHours(dayDate, startHour);
  const end = setHours(dayDate, endHour);

  return {
    id: template.id,
    start: start,
    end: end,
    color: {
      primary: '#54b054',
      secondary: '#54b054',
    },
    meta: template,
  } as CalendarEvent;
}

export function mapPublicSessionSummaryResponseToCreateUpdatePublicSessionRequest(
  summary: PublicSessionSummaryResponse
): CreateUpdatePublicSessionRequest {
  return {
    id: summary.id,
    title: summary.title,
    description: summary.description,
    date: summary.date,
    startTime: summary.startTime,
    endTime: summary.endTime,
    location: summary.location,
    type: summary.type,
    isCancelled: summary.isCancelled ?? false,
    thumbnailName: summary.thumbnailName ?? null,
  };
}

export function mapAvailabilityOverrideToCalendarEvent(
  override: AvailabilityOverrideResponse,
): CalendarEvent {
  const startDateTime = new Date(`${override.date}T${override.startTime}`);
  const endDateTime = new Date(`${override.date}T${override.endTime}`);

  // Define different styles for availability overrides
  const getEventStyle = (override: AvailabilityOverrideResponse) => {
    return override.isAvailable
      ? {
        primary: '#28a745',
        secondary: '#d4edda',
      }
      : {
        primary: '#dc3545',
        secondary: '#f8d7da',
      };
  };

  return {
    id: override.id,
    start: startDateTime,
    end: endDateTime,
    title: override.description || (override.isAvailable ? 'Available' : 'Unavailable'),
    color: getEventStyle(override),
    meta: override,
    draggable: false,
    resizable: {
      beforeStart: false,
      afterEnd: false,
    },
  };
}
