import { PrivateSessionRegistrationStatus } from '../../enums/private-session-registration-status.enum';

export interface UpdateClientRegistrationRequest {
  id: string;
  status: PrivateSessionRegistrationStatus;
  noteFromTherapist: string | null;
}
