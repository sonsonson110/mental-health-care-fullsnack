import { PublicSessionType } from '../enums/public-session-type.enum';
import { Gender } from '../enums/gender.enum';
import { PublicSessionFollowType } from '../enums/public-session-follow-type.enum';
import { IssueTag } from './issue-tag.model';

export interface PublicSessionSummaryResponse {
  id?: string;  // optional Guid
  therapist: TherapistDto;
  title: string;
  description: string;
  thumbnailName?: string | null;
  date: string;  // format: "YYYY-MM-DD"
  startTime: string;  // format: "HH:mm:ss"
  endTime: string;   // format: "HH:mm:ss"
  location: string;
  isCancelled?: boolean;
  type: PublicSessionType;
  followerCount: number;
  followingType: PublicSessionFollowType;
  updatedAt: Date;
  issueTags: IssueTag[];
}

interface TherapistDto {
  id: string;
  avatarName: string;
  fullName: string;
  gender: Gender
}
