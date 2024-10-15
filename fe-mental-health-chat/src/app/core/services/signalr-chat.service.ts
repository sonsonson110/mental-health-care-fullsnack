import { Injectable } from '@angular/core';
import { environment } from '../../environment/dev.environment';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { P2pMessageRequest } from '../models/p2p-message-request.model';
import { P2pMessageConfirmationResponse } from '../models/p2p-message-confirmation-response.model';
import { P2pConversationMessageDisplay } from '../models/p2p-conversation-mesage-display.model';

@Injectable()
export class SignalrChatService {
  private readonly hubExceptionMethodName = 'ChatHubException';
  private readonly hubUrl = environment.apiBaseUrl + '/chat';
  private hubConnection!: signalR.HubConnection;

  constructor(private authService: AuthService) {}

  async startConnection(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => this.authService.getToken()!,
      })
      .withAutomaticReconnect()
      .build();

    await this.hubConnection.start();
  }

  async stopConnection() {
    if (this.hubConnection) {
      await this.hubConnection.stop();
    }
  }

  onException(): Observable<string> {
    return new Observable<string>(observer => {
      this.hubConnection.on(this.hubExceptionMethodName, (data: string) => {
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
        });
    });
  }
}
