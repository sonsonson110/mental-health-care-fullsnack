import { Gender } from '../enums/gender.enum';
import { PublicSessionFollowType } from '../enums/public-session-follow-type.enum';

export interface PublicSessionFollowerResponse {
  id: string;
  userId: string;
  fullName: string;
  avatarName: string | null;
  gender: Gender;
  type: PublicSessionFollowType;
}
