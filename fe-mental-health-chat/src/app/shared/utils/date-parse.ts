import { format, parse } from 'date-fns';

export function  parseBackendConsumableDate(date: string): string {
  return new Date(date).toISOString().split('T')[0];
}

export function convert12to24(time: string): string {
  return format(parse(time, 'hh:mm a', new Date()), 'HH:mm:ss');
}
