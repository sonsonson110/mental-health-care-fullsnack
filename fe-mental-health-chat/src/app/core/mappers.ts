import { PrivateSessionScheduleResponse } from './models/modules/manage-schedules/private-session-schedule-response.model';
import { CalendarEvent } from 'angular-calendar';

export function mapPrivateSessionScheduleToCalendarEvent(
  schedule: PrivateSessionScheduleResponse
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
    title: `Session with ${schedule.client.fullName}`,
    color: getEventStyle(schedule),
    meta: schedule,
    draggable: false,
    resizable: {
      beforeStart: false,
      afterEnd: false,
    },
  };
}
