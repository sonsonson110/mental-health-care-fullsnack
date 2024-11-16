import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environment/dev.environment';
import {
  PrivateSessionScheduleResponse
} from '../models/modules/manage-schedules/private-session-schedule-response.model';
import {
  PrivateSessionScheduleRequest
} from '../models/modules/manage-schedules/private-session-schedule-request.model';

@Injectable({
  providedIn: 'root'
})
export class PrivateSessionSchedulesApiService {
  private readonly baseEndpoint = environment.apiBaseUrl + '/private-session-schedules';

  constructor(private http: HttpClient) { }

  getTherapistSchedules(request?: PrivateSessionScheduleRequest) {
    let params = new HttpParams();

    if (request) {
      params = params.set('startDate', request.startDate);
      params = params.set('endDate', request.endDate ?? '');
      request.privateRegistrationIds?.forEach(id => {
        params = params.append('privateRegistrationIds', id);
      });
    }

    return this.http.get<PrivateSessionScheduleResponse[]>(this.baseEndpoint, { params });
  }
}
