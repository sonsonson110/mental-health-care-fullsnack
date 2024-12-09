import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.dev';
import { NotificationResponse } from '../models/common/notification-response.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationApiService {
  private readonly baseUrl = environment.apiBaseUrl + '/notifications';

  constructor(private http: HttpClient) { }

  getNotifications() {
    return this.http.get<NotificationResponse[]>(this.baseUrl);
  }

  markNotificationAsRead(notificationId: string) {
    return this.http.patch(`${this.baseUrl}/${notificationId}/read`, null);
  }
}
