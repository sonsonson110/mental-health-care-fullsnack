import { Gender } from '../../enums/gender.enum';
import { TherapistEducation } from '../../common/therapist-education.model';
import { TherapistCertification } from '../../common/therapist-certification.model';
import { TherapistExperience } from '../../common/therapist-experience.model';

export interface UpdateUserRequest {
  avatarName: string | null;
  bio: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  dateOfBirth: string;
  gender: Gender;
  isTherapist: boolean;
  description: string | null;
  issueTagIds: string[];
  educations: TherapistEducation[];
  certifications: TherapistCertification[];
  experiences: TherapistExperience[];
}
