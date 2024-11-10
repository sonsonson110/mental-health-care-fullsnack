import { Gender } from '../../enums/gender.enum';

interface RegistrantDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: Gender;
}

export interface ClientRegistrationResponse {
  id: string;
  status: number;
  client: RegistrantDto;
  noteFromClient: string;
  noteFromTherapist: null | string;
  endDate: null | string;
  createdAt: string;
  updatedAt: string;
}
