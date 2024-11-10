import { PrivateSessionRegistrationStatus } from '../models/enums/private-session-registration-status.enum';

export const privateSessionRegistrationStatuses = [
  { key: PrivateSessionRegistrationStatus.PENDING, value: 'Pending' },
  { key: PrivateSessionRegistrationStatus.APPROVED, value: 'Approved' },
  { key: PrivateSessionRegistrationStatus.REJECTED, value: 'Rejected' },
  { key: PrivateSessionRegistrationStatus.FINISHED, value: 'Finished' },
  { key: PrivateSessionRegistrationStatus.CANCELED, value: 'Canceled' }
]
