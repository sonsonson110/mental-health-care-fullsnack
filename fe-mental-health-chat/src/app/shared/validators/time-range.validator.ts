import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isAfter, parse } from 'date-fns';

export function validateTimeRange(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const startTime = formGroup.get('startTime')?.value;
    const endTime = formGroup.get('endTime')?.value;
    const baseDate = formGroup.get('date')?.value || new Date();

    if (startTime && endTime) {
      const startDateTime = parse(startTime, 'hh:mm a', baseDate);
      const endDateTime = parse(endTime, 'hh:mm a', baseDate);

      if (!isAfter(endDateTime, startDateTime)) {
        return { invalidTimeRange: true };
      }
    }

    return null;
  };
}
