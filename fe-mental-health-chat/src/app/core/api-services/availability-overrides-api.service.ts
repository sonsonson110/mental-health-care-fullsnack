import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  AvailabilityOverrideResponse
} from '../models/modules/manage-working-time/availability-override-response.model';
import {
  CreateUpdateAvailabilityOverrideRequest
} from '../models/modules/manage-working-time/create-update-availability-override-request.model';
import {
  AvailabilityOverridesRequest
} from '../models/modules/manage-working-time/availability-overrides-request.model';

@Injectable({
  providedIn: 'root',
})
export class AvailabilityOverridesApiService {
  private readonly baseUrl = environment.apiBaseUrl + '/availability-overrides';

  constructor(private http: HttpClient) {}

  getAvailabilityOverrides(request: AvailabilityOverridesRequest) {
    let params = new HttpParams();
    params = params.set('startDate', request.startDate);
    params = params.set('endDate', request.endDate);
    return this.http.get<AvailabilityOverrideResponse[]>(this.baseUrl, { params });
  }

  createAvailabilityOverride(request: CreateUpdateAvailabilityOverrideRequest) {
    return this.http.post<AvailabilityOverrideResponse>(this.baseUrl, request);
  }

  updateAvailabilityOverride(request: CreateUpdateAvailabilityOverrideRequest) {
    return this.http.put<AvailabilityOverrideResponse>(this.baseUrl, request);
  }

  deleteAvailabilityOverride(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
