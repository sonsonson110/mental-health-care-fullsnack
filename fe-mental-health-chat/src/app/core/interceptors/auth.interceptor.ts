import { HttpInterceptorFn } from "@angular/common/http";
import { AuthApiService } from "../api-services/auth-api.service";
import { inject } from "@angular/core";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthApiService);
    const token = authService.getToken();

    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next(authReq);
    }

    return next(req);
  };
