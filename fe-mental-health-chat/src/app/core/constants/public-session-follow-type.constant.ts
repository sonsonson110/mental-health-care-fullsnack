import { PublicSessionFollowType } from '../models/enums/public-session-follow-type.enum';

export const publicSessionFollowTypes = [
  { key: PublicSessionFollowType.NONE, value: 'None' },
  { key: PublicSessionFollowType.INTERESTED, value: 'Interested' },
  { key: PublicSessionFollowType.ATTENDING, value: 'Attending' },
];
