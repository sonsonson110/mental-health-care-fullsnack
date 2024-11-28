import { DateOfWeek } from '../../enums/date-of-week.enum';

export interface CreateAvailabilityTemplateItemsRequest {
  items: CreateAvailabilityTemplateItem[];
}

export interface CreateAvailabilityTemplateItem {
  dateOfWeek: DateOfWeek;
  startTime: number;
  endTime: number;
}
