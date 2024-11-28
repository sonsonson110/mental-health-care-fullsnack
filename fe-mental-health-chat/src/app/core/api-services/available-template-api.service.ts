import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TherapistAvailabilityTemplateResponse } from '../models/common/therapist-availability-template-response.model';
import { CreateAvailabilityTemplateItemsRequest } from '../models/modules/manage-working-time/create-availability-template-items-request.model';
import { DeleteAvailabilityTemplateItemsRequest } from '../models/modules/manage-working-time/delete-availability-template-items-request.model';

@Injectable({
  providedIn: 'root',
})
export class AvailableTemplateApiService {
  private readonly baseUrl = environment.apiBaseUrl + '/availability-template';

  constructor(private http: HttpClient) {}

  getAvailableTemplateItems() {
    return this.http.get<TherapistAvailabilityTemplateResponse[]>(this.baseUrl);
  }

  createAvailableTemplateItems(request: CreateAvailabilityTemplateItemsRequest) {
    return this.http.post(this.baseUrl, request);
  }

  deleteAvailableTemplateItems(request: DeleteAvailabilityTemplateItemsRequest) {
    let params = new HttpParams();
    request.itemIds.forEach(id => (params = params.append('itemIds', id)));
    return this.http.delete(this.baseUrl, { params });
  }
}
