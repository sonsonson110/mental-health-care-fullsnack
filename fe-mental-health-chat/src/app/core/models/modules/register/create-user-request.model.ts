import { Gender } from '../../enums/gender.enum';
import { CreateCertificationRequest } from './create-certification-request.model';
import { CreateEducationRequest } from './create-education-request.model';
import { CreateExperienceRequest } from './create-experience-request.model';

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
  educations: CreateEducationRequest[];
  certifications: CreateCertificationRequest[];
  experiences: CreateExperienceRequest[];
  bio: string | null;
  issueTagIds: string[];
  avatarName: string | null;
  description: string | null;
}
