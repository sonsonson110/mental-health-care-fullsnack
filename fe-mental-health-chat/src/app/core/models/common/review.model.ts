import { Gender } from '../enums/gender.enum';

export interface Review {
  id: string;
  clientId: string;
  clientFullName: string;
  clientAvatarName: string | null;
  clientGender: Gender
  rating: number;
  comment: string;
  updatedAt: string;
}
