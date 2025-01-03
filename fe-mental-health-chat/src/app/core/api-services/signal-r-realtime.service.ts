import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthApiService } from './auth-api.service';
import * as signalR from '@microsoft/signalr';
import { NotificationResponse } from '../models/common/notification-response.model';

@Injectable({
  providedIn: 'root',
})
export class SignalRRealtimeService {
  private readonly hubExceptionMethodName = 'RealtimeHubException';
  private readonly hubUrl = environment.apiBaseUrl + '/realtime';
  private hubConnection!: signalR.HubConnection;

  private connectionState = new BehaviorSubject(false);
  readonly connectionState$ = this.connectionState.asObservable();

  constructor(
    private authService: AuthApiService,
    private toastr: ToastrService
  ) {}

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => this.authService.getToken()!,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          // Reconnect every 2 seconds
          return 2000 + retryContext.previousRetryCount;
        },
      })
      .build();

    this.hubConnection
      .start()
      .then(() => this.connectionState.next(true))
      .catch(() => {
        // error is considered only if connection state is true
        // connection state can only be set to false from here or stopConnection method
        if (this.connectionState.value) {
          this.connectionState.next(false);
          console.log('Websocket failed to start');
          this.toastr.error(
            'Try to refresh the page or contact author',
            'Websocket failed to start',
            { disableTimeOut: true }
          );
        }
      });

    this.hubConnection.onreconnecting(() => {
      this.toastr.warning('Attempting to reconnect...', undefined, {
        disableTimeOut: true,
      });
    });

    this.hubConnection.onreconnected(connectionId => {
      this.connectionState.next(true);
      this.toastr.clear();
      this.toastr.success(connectionId || '', 'Connection restored');
    });
  }

  async stopConnection() {
    if (this.hubConnection) {
      this.connectionState.next(false);
      await this.hubConnection.stop();
    }
  }

  receiveNotification(): Observable<NotificationResponse> {
    return new Observable<NotificationResponse>(observer => {
      this.hubConnection.on(
        'ReceiveNotification',
        (notification: NotificationResponse) => {
          observer.next(notification);
        }
      );
    });
  }

  onUserOnlineStatusChanged(): Observable<{ userId: string; isOnline: boolean }> {
    return new Observable<{ userId: string; isOnline: boolean }>(observer => {
      this.hubConnection.on(
        'UserOnlineStatusChanged',
        (status: { userId: string; isOnline: boolean }) => {
          observer.next(status);
        }
      );
    });
  }
}
