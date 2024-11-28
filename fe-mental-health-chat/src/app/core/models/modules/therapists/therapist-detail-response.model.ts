import { TherapistEducation } from '../../common/therapist-education.model';
import { TherapistExperience } from '../../common/therapist-experience.model';
import { TherapistCertification } from '../../common/therapist-certification.model';
import { IssueTag } from '../../common/issue-tag.model';
import { Review } from '../../common/review.model';
import { TherapistAvailabilityTemplateResponse } from '../../common/therapist-availability-template-response.model';

export interface TherapistDetailResponse {
  id: string,
  fullName: string;
  gender: number;
  dateOfBirth: string;
  avatarName: string | null;
  email: string;
  createdAt: string;
  clientCount: number;
  description: string | null;
  educations: TherapistEducation[];
  experiences: TherapistExperience[];
  certifications: TherapistCertification[];
  therapistReviews: Review[];
  availabilityTemplates: TherapistAvailabilityTemplateResponse[];
  issueTags: IssueTag[];
}
