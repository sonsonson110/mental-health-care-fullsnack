import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthApiService } from '../api-services/auth-api.service';
import { userTypes } from '../constants/user-type.constant';
import { UserType } from '../models/enums/user-type.enum';

export const therapistOnlyGuard: CanActivateFn = () => {
  const authService = inject(AuthApiService);
  const router = inject(Router);

  // If user does not have therapist role, redirect to 404 page
  const sessionUserRole = authService.getSessionUserRole();
  const therapistValue = userTypes.find(t => t.key === UserType.THERAPIST)?.value;
  const isTherapist = therapistValue
    ? (sessionUserRole?.includes(therapistValue) ?? false)
    : false;
  if (!isTherapist) {
    router.navigate(['not-found']);
    return false;
  }

  return true;
};
