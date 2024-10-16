import { Injectable } from '@angular/core';
import { P2pConversationMessageDisplay } from '../../../../core/models/p2p-conversation-mesage-display.model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class P2pConversationMessageDisplayService {
  private messagesSubject = new BehaviorSubject<P2pConversationMessageDisplay[]>([]);
  messages$ = this.messagesSubject.asObservable();

  initializeMessages(messages: P2pConversationMessageDisplay[]) {
    this.messagesSubject.next(messages);
  }

  getMessages() {
    return this.messages$;
  }

  addMessage(message: P2pConversationMessageDisplay) {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  updateMessage(updatedMessage: P2pConversationMessageDisplay) {
    const currentMessages = this.messagesSubject.value.map(msg =>
      msg.id === updatedMessage.id ? updatedMessage : msg
    );
    this.messagesSubject.next(currentMessages);
  }

  markSendingMessageSent(message: P2pConversationMessageDisplay) {
    const currentMessages = this.messagesSubject.value;
    for (let i = currentMessages.length - 1; i >= 0; i--) {
      if (currentMessages[i].isSending) {
        currentMessages[i].isSending = false;
        currentMessages[i].createdAt = message.createdAt;
        break;
      }
    }
    this.messagesSubject.next(currentMessages);
  }

  markLastSendingMessageAsError() {
    const currentMessages = this.messagesSubject.value;
    for (let i = currentMessages.length - 1; i >= 0; i--) {
      if (currentMessages[i].isSending) {
        currentMessages[i].isError = true;
        break;
      }
    }
    this.messagesSubject.next(currentMessages);
  }
}
