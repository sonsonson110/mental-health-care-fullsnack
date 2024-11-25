import { Gender } from '../../enums/gender.enum';

export interface PostResponse {
  id: string;
  title: string;
  content: string;
  isPrivate: boolean;
  updatedAt: string;
  likeCount: number;
  isLiked: boolean;
  user : {
    id: string;
    fullName: string;
    avatarName: string | null;
    gender: Gender;
  }
}
