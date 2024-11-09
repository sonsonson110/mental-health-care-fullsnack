import { Injectable } from '@angular/core';
import { environment } from '../../environment/dev.environment';
import { HttpClient } from '@angular/common/http';
import { RegisterTherapist } from '../models/modules/therapists/register-therapist-request.model';

@Injectable({
  providedIn: 'root',
})
export class PrivateSessionRegistrationsApiService {
  private readonly baseUrl = environment.apiBaseUrl + '/private-session-registrations';

  constructor(private http: HttpClient) {}

  public registerPrivateSession(body: RegisterTherapist) {
    return this.http.post(`${this.baseUrl}/register`, body);
  }
}
