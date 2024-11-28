import { Pipe, PipeTransform } from '@angular/core';
import { DateOfWeek } from '../../core/models/enums/date-of-week.enum';
import { datesOfWeek } from '../../core/constants/dates-of-week.constant';

@Pipe({
  name: 'dateOfWeek',
  standalone: true
})
export class DateOffWeekPipe implements PipeTransform {
  transform(key: DateOfWeek): string {
    const dateString = datesOfWeek.find(g => g.key === key);
    return dateString ? dateString.value : 'Undefined';
  }
}
