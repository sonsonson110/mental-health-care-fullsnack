import { Injectable } from '@angular/core';
import { environment } from '../../environment/dev.environment';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { P2pMessageRequest } from '../models/p2p-message-request.model';
import { P2pConversationMessageDisplay } from '../models/p2p-conversation-mesage-display.model';
import { ToastrService } from 'ngx-toastr';
import { ProblemDetail } from '../models/common/problem-detail.model';

@Injectable()
export class SignalrChatService {
  private readonly hubExceptionMethodName = 'ChatHubException';
  private readonly hubUrl = environment.apiBaseUrl + '/chat';
  private hubConnection!: signalR.HubConnection;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  async startConnection(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => this.authService.getToken()!,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          // Recommended every 2 seconds
          return 2000 + retryContext.previousRetryCount;
        },
      })
      .build();

    this.hubConnection
      .start()
      .then(() => this.toastr.clear())
      .catch(() =>
        this.toastr.error(
          'Try to refresh the page or contact author',
          'Websocket failed to start',
          { disableTimeOut: true }
        )
      );

    this.hubConnection.onreconnecting(() => {
      this.toastr.warning('Attempting to reconnect...', undefined, {
        disableTimeOut: true,
      });
    });

    this.hubConnection.onreconnected(connectionId => {
      this.toastr.clear();
      this.toastr.success(connectionId || '', 'Connection restored');
    });
  }

  async stopConnection() {
    if (this.hubConnection) {
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
          observer.complete();
        })
        .catch(reason => this.toastr.error(reason, "Message wasn't sent"));
    });
  }
}
