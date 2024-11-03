import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/dev.environment';
import { TherapistSummaryResponse } from '../models/modules/therapists/therapist-summary-response.model';

@Injectable({
  providedIn: 'root'
})
export class TherapistsService {
  private readonly baseEndpoint = environment.apiBaseUrl + '/therapists';

  constructor(private http: HttpClient) { }

  getTherapistSummaries() {
    return this.http.get<TherapistSummaryResponse[]>(this.baseEndpoint + '/summary');
  }
}
