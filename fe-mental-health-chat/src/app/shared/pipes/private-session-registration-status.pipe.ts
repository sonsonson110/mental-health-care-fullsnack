import { Pipe, PipeTransform } from '@angular/core';
import { privateSessionRegistrationStatuses } from '../../core/constants/private-session-registration-status.constant';
import { PrivateSessionRegistrationStatus } from '../../core/models/enums/private-session-registration-status.enum';

@Pipe({
  name: 'privateSessionRegistrationStatus',
  standalone: true
})
export class PrivateSessionRegistrationStatusPipe implements PipeTransform {

  private readonly privateSessionRegistrationStatuses = privateSessionRegistrationStatuses;

  transform(status: PrivateSessionRegistrationStatus): string {
    const statusString = privateSessionRegistrationStatuses.find(s => s.key === status);
    return statusString ? statusString.value : 'Undefined';
  }
}
