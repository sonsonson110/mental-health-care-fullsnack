import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { ProblemDetail } from "../models/problem-detail.model";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
          return throwError(() => error.error as ProblemDetail);
      }),
    );
  };