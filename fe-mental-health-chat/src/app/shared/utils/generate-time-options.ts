import { format, setHours, setMinutes } from 'date-fns';

export function generateTimeOptions(startHour = 5, endHour = 22): string[] {
  const times: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    // Add hour mark
    times.push(format(setHours(setMinutes(new Date(), 0), hour), 'hh:mm a'));
    times.push(format(setHours(setMinutes(new Date(), 30), hour), 'hh:mm a'));
  }
  return times;
}
