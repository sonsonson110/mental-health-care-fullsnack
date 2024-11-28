import { PrivateSessionRegistrationStatus } from '../enums/private-session-registration-status.enum';
import { Gender } from '../enums/gender.enum';

export interface TherapistRegistrationResponse {
  id: string;
  status: PrivateSessionRegistrationStatus;
  noteFromTherapist?: string;
  noteFromClient: string;
  endDate?: string;
  createdAt: string;
  therapist: TherapistDto;
}

interface TherapistDto {
  id: string;
  avatarName?: string; // Optional, can be null
  fullName: string;
  gender: Gender;
}
