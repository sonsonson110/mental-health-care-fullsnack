import { PublicSessionFollowType } from '../../enums/public-session-follow-type.enum';

export interface CalendarFollowedPublicSessionResponse {
  publicSessionId: string;
  therapistFullName: string;
  title: string;
  followingType: PublicSessionFollowType;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
  isCancelled: boolean;
}
