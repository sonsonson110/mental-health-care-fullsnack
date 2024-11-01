import { Gender } from '../../enums/gender.enum';
import { TherapistCertification } from '../../common/therapist-certification.model';
import { TherapistEducation } from '../../common/therapist-education.model';
import { TherapistExperience } from '../../common/therapist-experience.model';

export interface CreateUserRequest {
  userName: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  email: string;
  phoneNumber: string | null;
  password: string;
  isTherapist: boolean;
  educations: TherapistEducation[];
  certifications: TherapistCertification[];
  experiences: TherapistExperience[];
  bio: string | null;
  issueTagIds: string[];
  avatarName: string | null;
  description: string | null;
}
