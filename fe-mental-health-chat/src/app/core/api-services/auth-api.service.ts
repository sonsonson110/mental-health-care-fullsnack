import { Injectable } from '@angular/core';
import { environment } from '../../environment/dev.environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/modules/login/login-request.model';
import { BehaviorSubject, map } from 'rxjs';
import { JwtPayload } from '../models/common/jwt-payload.model';
import { LoginResponse } from '../models/modules/login/login-response.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly baseEndpoint = environment.apiBaseUrl + '/auth';
  private readonly localStorageTokenKey = 'Jwt';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  login(body: LoginRequest) {
    return this.http
      .post<LoginResponse>(this.baseEndpoint + '/login', body)
      .pipe(
        map(response => this.setToken(response.token))
      );
  }

  private checkAuthStatus() {
    const token = this.getToken();
    this.isAuthenticatedSubject.next(!!token);
    this.isLoadingSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.localStorageTokenKey);
  }

  private setToken(token: string) {
    localStorage.setItem(this.localStorageTokenKey, token);
    this.isAuthenticatedSubject.next(true);
  }

  removeToken() {
    localStorage.removeItem(this.localStorageTokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  handleLogout(): void {
    this.removeToken();
    this.router.navigate(['/login']);
  }

  private decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (token == null) return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
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

  getSessionUserId = (): string | undefined =>
    this.decodeToken()?.[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    ];

  getSessionUserName = (): string | undefined =>
    this.decodeToken()?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

  getSessionUserRole = () =>
    this.decodeToken()?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
}
