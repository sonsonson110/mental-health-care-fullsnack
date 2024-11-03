import { Gender } from '../../enums/gender.enum';

export interface TherapistSummaryResponse {
  id: string;
  fullName: string;
  gender: Gender;
  avatarName: string | null;
  bio: string | null;
  issueTags: string[];
  lastExperience: string;
  experienceCount: number;
  lastEducation: string;
  educationCount: number;
  certificationCount: number;
  rating: number;
  clientCount: number;
}
