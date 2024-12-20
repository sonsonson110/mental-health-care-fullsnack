import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.dev';
import {
  PrivateSessionScheduleResponse,
} from '../models/modules/manage-schedules/therapist-schedule-response.model';
import {
  PrivateSessionScheduleRequest,
} from '../models/modules/manage-schedules/therapist-schedule-request.model';
import { CreateUpdateScheduleRequest } from '../models/modules/manage-schedules/create-update-schedule-request.model';
import { ClientSchedulesRequest } from '../models/modules/my-schedules/client-schedules-request.model';

@Injectable({
  providedIn: 'root',
})
export class PrivateSessionSchedulesApiService {
  private readonly baseEndpoint = environment.apiBaseUrl + '/private-session-schedules';

  constructor(private http: HttpClient) {
  }

  getTherapistSchedules(request?: PrivateSessionScheduleRequest) {
    let params = new HttpParams();

    if (request) {
      params = params.set('startDate', request.startDate);
      params = params.set('endDate', request.endDate ?? '');
      request.privateRegistrationIds?.forEach(id => {
        params = params.append('privateRegistrationIds', id);
      });
    }

    return this.http.get<PrivateSessionScheduleResponse[]>(this.baseEndpoint + '/therapist', { params });
  }

  getClientSchedules(request?: ClientSchedulesRequest) {
    let params = new HttpParams();

    if (request) {
      params = params.set('startDate', request.startDate);
      params = params.set('endDate', request.endDate ?? '');
    }
    return this.http.get<PrivateSessionScheduleResponse[]>(this.baseEndpoint + '/client', { params });
  }

  createSchedule(request: CreateUpdateScheduleRequest) {
    return this.http.post<{ id: string }>(this.baseEndpoint, request);
  }

  updateSchedule(request: CreateUpdateScheduleRequest) {
    return this.http.put(this.baseEndpoint, request);
  }
}
