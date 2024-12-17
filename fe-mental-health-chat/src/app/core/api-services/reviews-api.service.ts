import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';
import {
  CreateUpdateTherapistReviewRequest
} from '../models/modules/profile/create-update-therapist-review-request.model';
import { TherapistReviewResponse } from '../models/modules/profile/therapist-review-response.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewsApiService {
  private readonly baseUrl = environment.apiBaseUrl + '/reviews';

  constructor(private http: HttpClient) {
  }

  getTherapistReviewByTherapistId(therapistId: string) {
    return this.http.get<TherapistReviewResponse>(`${this.baseUrl}/therapists/${therapistId}`);
  }

  createTherapistReview(request: CreateUpdateTherapistReviewRequest) {
    return this.http.post(this.baseUrl, request);
  }

  updateTherapistReview(request: CreateUpdateTherapistReviewRequest) {
    return this.http.put(this.baseUrl, request);
  }
}
