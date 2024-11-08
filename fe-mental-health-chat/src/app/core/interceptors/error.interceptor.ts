import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ProblemDetail } from '../models/common/problem-detail.model';
import { AuthApiService } from '../api-services/auth-api.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const authService = inject(AuthApiService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // client-side error
      if (error.error instanceof TypeError) {
        const problemDetail: ProblemDetail = {
          title: 'Unknown Error',
          status: 0,
          detail: error.error.message,
        };
        return throwError(() => problemDetail);
      }

      // Handle unauthorized error (401)
      if (error.status === 401) {
        // Check WWW-Authenticate header for specific error
        const wwwAuthenticate = error.headers.get('WWW-Authenticate');
        const isTokenError =
          wwwAuthenticate?.includes('token_expired') ||
          wwwAuthenticate?.includes('invalid_token');

        if (isTokenError) {
          authService.handleLogout();

          const problemDetail: ProblemDetail = {
            title: 'Authentication Error',
            status: 401,
            detail: 'Your session has expired. Please log in again.',
          };

          toastr.error(problemDetail.detail, problemDetail.title);
          return throwError(() => problemDetail);
        }
      }

      const problemDetail = error.error as ProblemDetail;
      toastr.error(problemDetail.detail, problemDetail.title);

      // other server-side error (400)
      return throwError(() => problemDetail);
    })
  );
};
