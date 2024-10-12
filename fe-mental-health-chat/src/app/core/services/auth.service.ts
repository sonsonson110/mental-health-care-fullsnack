import { Injectable } from '@angular/core';
import { environment } from '../../environment/dev.environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/modules/login/login-request.model';
import { map } from 'rxjs';
import { JwtPayload } from '../models/jwt-payload.model';
import { LoginResponse } from '../models/modules/login/login-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseEndpoint = environment.apiBaseUrl + '/auth';
  private readonly localStorageTokenKey = 'Jwt';

  constructor(private http: HttpClient) {}

  login(body: LoginRequest) {
    return this.http
      .post<LoginResponse>(this.baseEndpoint + '/login', body)
      .pipe(
        map(response => localStorage.setItem(this.localStorageTokenKey, response.token))
      );
  }

  logout = () => localStorage.removeItem(this.localStorageTokenKey);

  getToken(): string | null {
    return localStorage.getItem(this.localStorageTokenKey);
  }

  decodeToken(): JwtPayload | null {
    var token = this.getToken();
    if (token == null) return null;

    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}
