import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { P2pConversationSidenavItem } from '../../../../core/models/p2p-conversation-sidenav-item.model';
import { ConversationsApiService } from '../../../../core/api-services/conversations-api.service';
import { SignalRChatService } from '../../../../core/api-services/signal-r-chat.service';
import { P2pConversationMessageDisplay } from '../../../../core/models/p2p-conversation-mesage-display.model';
import { P2pMessageDto } from '../../../../core/models/p2p-conversation-detail-response.model';
import { ToastrService } from 'ngx-toastr';
import { P2pMessageRequest } from '../../../../core/models/p2p-message-request.model';

@Injectable()
export class P2pConversationStateService {
  private sidenavLoadingState = new BehaviorSubject<boolean>(true);
  readonly sidenavLoadingState$ = this.sidenavLoadingState.asObservable();

  // chat histories on side nav
  private p2pConversationSidenavItems: BehaviorSubject<P2pConversationSidenavItem[]> =
    new BehaviorSubject<P2pConversationSidenavItem[]>([]);
  readonly p2pConversationSidenavItems$ = this.p2pConversationSidenavItems.asObservable();

  // open/close sidenav state
  private sidenavOpenState = new BehaviorSubject<boolean>(true);
  readonly sidenavOpenState$ = this.sidenavOpenState.asObservable();

  // box messages
  private chatboxLoadingState = new BehaviorSubject<boolean>(true);
  readonly chatboxLoadingState$ = this.chatboxLoadingState.asObservable();

  private messages = new BehaviorSubject<P2pConversationMessageDisplay[]>([]);
  messages$ = this.messages.asObservable();

  constructor(
    private conversationsApiService: ConversationsApiService,
    private signalRChatService: SignalRChatService,
    private toastr: ToastrService
  ) {}

  //region side nav methods
  toggleSidenavOpenState() {
    const currentState = this.sidenavOpenState.getValue();
    this.sidenavOpenState.next(!currentState);
  }

  setSidenavOpenState(state: boolean) {
    this.sidenavOpenState.next(state);
  }

  //endregion

  //region chat histories on side nav methods
  initialP2pConversationSidenavItem(conversationType: string) {
    if (conversationType === 'therapist-chats') {
      this.conversationsApiService
        .getTherapistConversations()
        .subscribe((data: P2pConversationSidenavItem[]) => {
          this.p2pConversationSidenavItems.next(data);
          this.sidenavLoadingState.next(false);
        });
    } else if (conversationType === 'client-chats') {
      this.conversationsApiService
        .getClientConversations()
        .subscribe((data: P2pConversationSidenavItem[]) => {
          this.p2pConversationSidenavItems.next(data);
          this.sidenavLoadingState.next(false);
        });
    }
  }

  private getP2pConversationSidenavItemById(id: string): P2pConversationSidenavItem {
    return this.p2pConversationSidenavItems.getValue().find(h => h.id === id)!;
  }

  private updateP2pConversationSidenavItem(history: P2pConversationSidenavItem) {
    const histories = this.p2pConversationSidenavItems.getValue();
    const index = histories.findIndex(h => h.id === history.id);
    if (index !== -1) {
      histories[index] = history;
      this.p2pConversationSidenavItems.next(histories);
    }
  }

  private addP2pConversationSidenavItem(history: P2pConversationSidenavItem) {
    const histories = this.p2pConversationSidenavItems.getValue();
    histories.unshift(history); // Add the new item at the beginning
    this.p2pConversationSidenavItems.next(histories);
  }

  //endregion

  //region signalr chat methods

  initSignalrConnection(conversationId: string, sessionUserId: string) {
    this.signalRChatService.startConnection();

    // start all observations
    this.signalRChatService.connectionState$.subscribe(state => {
      if (!state) return;

      console.log("Websocket '/chat' started for " + conversationId);

      this.signalRChatService.receiveP2PMessage().subscribe(message => {
        const currentSidenavItem = this.getP2pConversationSidenavItemById(
          message.conversationId!
        );
        currentSidenavItem.lastMessage = {
          id: message.id,
          senderId: message.senderId,
          senderFullName: message.senderFullName,
          content: message.content,
          createdAt: message.createdAt,
          isRead: message.isRead,
        };
        this.updateP2pConversationSidenavItem(currentSidenavItem);

        if (message.conversationId !== conversationId) return;
        if (message.senderId !== sessionUserId) {
          this.addMessage(message);
        } else {
          this.markSendingMessageSent(message);
        }
      });

      this.signalRChatService.onException().subscribe(error => {
        this.toastr.error(error.detail);
        this.markLastSendingMessageAsError();
      });
    });
  }

  stopSignalrConnection() {
    return this.signalRChatService.stopConnection();
  }

  sendMessage(message: P2pMessageRequest) {
    return this.signalRChatService.sendP2PMessage(message);
  }

  //endregion

  //region messages methods

  loadMessages(
    conversationId: string,
    conversationType: 'therapist-chats' | 'client-chats'
  ) {
    const apiCall =
      conversationType === 'therapist-chats'
        ? this.conversationsApiService.getTherapistConversationDetailById(conversationId)
        : this.conversationsApiService.getClientConversationDetailById(conversationId);

    return apiCall.pipe(
      tap(response => {
        this.messages.next(response.messages.map(this.mapToP2pMessageDisplay));
      }),
      finalize(() => {
        this.chatboxLoadingState.next(false);
      })
    );
  }

  addMessage(message: P2pConversationMessageDisplay) {
    const currentMessages = this.messages.value;
    this.messages.next([...currentMessages, message]);
  }

  updateMessage(updatedMessage: P2pConversationMessageDisplay) {
    const currentMessages = this.messages.value.map(msg =>
      msg.id === updatedMessage.id ? updatedMessage : msg
    );
    this.messages.next(currentMessages);
  }

  markSendingMessageSent(message: P2pConversationMessageDisplay) {
    const currentMessages = this.messages.value;
    for (let i = currentMessages.length - 1; i >= 0; i--) {
      if (currentMessages[i].isSending) {
        currentMessages[i].isSending = false;
        currentMessages[i].createdAt = message.createdAt;
        break;
      }
    }
    this.messages.next(currentMessages);
  }

  markLastSendingMessageAsError() {
    const currentMessages = this.messages.value;
    for (let i = currentMessages.length - 1; i >= 0; i--) {
      if (currentMessages[i].isSending) {
        currentMessages[i].isError = true;
        break;
      }
    }
    this.messages.next(currentMessages);
  }

  //endregion

  private mapToP2pMessageDisplay(dto: P2pMessageDto): P2pConversationMessageDisplay {
    return {
      id: dto.id,
      senderId: dto.senderId,
      senderFullName: dto.senderFullName,
      content: dto.content,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      isRead: dto.isRead,
    };
  }
}
