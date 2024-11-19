import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';
import { RegisterTherapist } from '../models/modules/therapists/register-therapist-request.model';
import { ClientRegistrationResponse } from '../models/modules/manage-registrations/client-registration-response.model';
import {
  UpdateClientRegistrationRequest
} from '../models/modules/manage-registrations/update-client-registration-request.model';

@Injectable({
  providedIn: 'root',
})
export class PrivateSessionRegistrationsApiService {
  private readonly baseUrl = environment.apiBaseUrl + '/private-session-registrations';

  constructor(private http: HttpClient) {}

  registerPrivateSession(body: RegisterTherapist) {
    return this.http.post(`${this.baseUrl}/register`, body);
  }

  getClientRegistrations() {
    return this.http.get<ClientRegistrationResponse[]>(`${this.baseUrl}/client-registrations`);
  }

  updateClientRegistration(body: UpdateClientRegistrationRequest) {
    return this.http.put(`this.baseUrl`, body);
  }
}
