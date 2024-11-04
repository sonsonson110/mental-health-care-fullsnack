import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthApiService } from '../api-services/auth-api.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthApiService);
  const router = inject(Router);

  if (authService.getToken()) {
    return true;
  }

  // Redirect to login page with return url
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
