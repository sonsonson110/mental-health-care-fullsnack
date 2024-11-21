import { PublicSessionType } from '../../enums/public-session-type.enum';

export interface CreateUpdatePublicSessionRequest {
  id?: string;
  title: string;
  description: string;
  thumbnailName: string | null;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isCancelled: boolean;
  type: PublicSessionType;
}
