import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthApiService } from '../../core/api-services/auth-api.service';
import { NotificationApiService } from '../../core/api-services/notification-api.service';
import { NotificationResponse } from '../../core/models/common/notification-response.model';
import { BehaviorSubject, finalize } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { SignalRRealtimeService } from '../../core/api-services/signal-r-realtime.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    CommonModule,
    MatBadgeModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit {
  @Output() toggleMenu = new EventEmitter<void>();

  notificationLoading = false;

  private notifications = new BehaviorSubject<NotificationResponse[]>([]);
  readonly notifications$ = this.notifications.asObservable();

  constructor(
    private authService: AuthApiService,
    private notificationApiService: NotificationApiService,
    private signalRRealtimeService: SignalRRealtimeService
  ) {}

  ngOnInit(): void {
    this.notificationLoading = true;
    this.notificationApiService
      .getNotifications()
      .pipe(finalize(() => (this.notificationLoading = false)))
      .subscribe(notifications => {
        this.notifications.next(notifications);
      });
  }

  get unreadNotificationsCount() {
    return this.notifications.value.filter(notification => !notification.isRead).length;
  }

  markNotificationAsRead(notification: NotificationResponse) {
    if (notification.isRead) return;

    this.notificationApiService.markNotificationAsRead(notification.id).subscribe(() => {
      const notifications = this.notifications.value;
      const oldNotification = notifications.find(n => n.id === notification.id);
      if (oldNotification) {
        oldNotification.isRead = true;
        this.notifications.next([...notifications, oldNotification]);
      }
    });
  }

  onMenuClick() {
    this.toggleMenu.emit();
  }

  onLogoutClick() {
    this.signalRRealtimeService.stopConnection()
      .then(() => this.authService.handleLogout());
  }
}
