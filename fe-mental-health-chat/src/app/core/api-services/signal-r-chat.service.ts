import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import * as signalR from '@microsoft/signalr';
import { AuthApiService } from './auth-api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { P2pMessageRequest } from '../models/common/p2p-message-request.model';
import { P2pConversationMessageDisplay } from '../models/common/p2p-conversation-mesage-display.model';
import { ToastrService } from 'ngx-toastr';
import { ProblemDetail } from '../models/common/problem-detail.model';

@Injectable()
export class SignalRChatService {
  private readonly hubExceptionMethodName = 'ChatException';
  private readonly hubUrl = environment.apiBaseUrl + '/chat';
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

  onException(): Observable<ProblemDetail> {
    return new Observable<ProblemDetail>(observer => {
      this.hubConnection.on(this.hubExceptionMethodName, (data: ProblemDetail) => {
        this.toastr.error(data.detail, data.title);
        observer.next(data);
      });
    });
  }

  receiveP2PMessage() {
    return new Observable<P2pConversationMessageDisplay>(observer => {
      this.hubConnection.on('ReceiveP2PMessage', (msg: P2pConversationMessageDisplay) => {
        observer.next(msg);
      });
    });
  }

  sendP2PMessage(message: P2pMessageRequest) {
    return new Observable<void>(observer => {
      this.hubConnection
        .invoke<P2pMessageRequest>('SendP2PMessage', message)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(reason => this.toastr.error(reason, "Message wasn't sent"));
    });
  }
}
