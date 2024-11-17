import { Gender } from '../../enums/gender.enum';

export interface CurrentClientResponse {
  clientId: string;
  privateSessionRegistrationId: string;
  fullName: string;
  email: string;
  avatarName: string | null;
  gender: Gender;
}
