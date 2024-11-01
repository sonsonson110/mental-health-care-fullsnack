import { Gender } from '../../enums/gender.enum';
import { TherapistEducation } from '../../common/therapist-education.model';
import { TherapistCertification } from '../../common/therapist-certification.model';
import { TherapistExperience } from '../../common/therapist-experience.model';
import { IssueTag } from '../../common/issue-tag.model';

export interface UserDetailResponse {
  id: string;
  avatarName: string | null;
  bio: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  dateOfBirth: string;
  gender: Gender;
  isTherapist: boolean
  description: string | null;
  issueTags: IssueTag[];
  educations: TherapistEducation[];
  certifications: TherapistCertification[];
  experiences: TherapistExperience[];
}
