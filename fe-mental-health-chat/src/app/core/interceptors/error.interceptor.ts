import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ProblemDetail } from '../models/problem-detail.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
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
      return throwError(() => error.error as ProblemDetail);
    })
  );
};
