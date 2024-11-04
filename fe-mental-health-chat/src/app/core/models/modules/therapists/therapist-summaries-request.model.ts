import { Gender } from '../../enums/gender.enum';
import { DateOfWeek } from '../../enums/date-of-week.enum';

export interface TherapistSummariesRequest {
  searchText: string | null;
  issueTagIds: string[];
  startRating: number | null;
  endRating: number | null;
  genders: Gender[];
  minExperienceYear: number | null;
  maxExperienceYear: number | null;
  dateOfWeekOptions: DateOfWeek[];
}
