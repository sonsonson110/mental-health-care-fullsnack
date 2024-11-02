import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const publicOnlyGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If user is already authenticated, redirect to home
  if (authService.getToken()) {
    router.navigate(['']);
    return false;
  }

  return true;
};
