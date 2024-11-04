import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environment/dev.environment';
import { TherapistSummaryResponse } from '../models/modules/therapists/therapist-summary-response.model';
import { TherapistSummariesRequest } from '../models/modules/therapists/therapist-summaries-request.model';

@Injectable({
  providedIn: 'root',
})
export class TherapistsApiService {
  private readonly baseEndpoint = environment.apiBaseUrl + '/therapists';

  constructor(private http: HttpClient) {}

  getTherapistSummaries(request?: TherapistSummariesRequest) {
    let params = new HttpParams();

    if (request) {
      if (request.searchText) {
        params = params.set('searchText', request.searchText);
      }

      request.issueTagIds.forEach(tagId => {
        params = params.append('issueTagIds', tagId);
      });

      request.genders.forEach(gender => {
        params = params.append('genders', gender);
      });

      request.dateOfWeekOptions.forEach(dateOfWeek => {
        params = params.append('dateOfWeekOptions', dateOfWeek);
      });

      if (request.startRating !== null) {
        params = params.set('startRating', request.startRating);
      }
      if (request.endRating !== null) {
        params = params.set('endRating', request.endRating);
      }

      if (request.minExperienceYear !== null) {
        params = params.set('minExperienceYear', request.minExperienceYear);
      }

      if (request.maxExperienceYear !== null) {
        params = params.set('maxExperienceYear', request.maxExperienceYear);
      }
    }

    return this.http.get<TherapistSummaryResponse[]>(this.baseEndpoint + '/summary', {
      params,
    });
  }
}
