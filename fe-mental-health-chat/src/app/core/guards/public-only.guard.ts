import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthApiService } from '../api-services/auth-api.service';

export const publicOnlyGuard: CanActivateFn = () => {
  const authService = inject(AuthApiService);
  const router = inject(Router);

  // If user is already authenticated, redirect to home
  if (authService.getToken()) {
    router.navigate(['']);
    return false;
  }

  return true;
};
