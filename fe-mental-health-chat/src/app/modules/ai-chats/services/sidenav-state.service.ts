import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatbotHistorySideNavItem } from '../../../core/models/modules/ai-chats/chatbot-history-side-nav-item.model';

@Injectable({
  providedIn: 'root'
})
export class SidenavStateService {
  private aiChatHistories = new BehaviorSubject<ChatbotHistorySideNavItem[]>([]);
  aiChatHistories$ = this.aiChatHistories.asObservable();

  private sidenavStateSubject = new BehaviorSubject<boolean>(true); // Default state is open
  sidenavState$ = this.sidenavStateSubject.asObservable();

  // open/close sidenav state
  emitStateEvent(state: boolean) {
    this.sidenavStateSubject.next(state);
  }

  toggleState() {
    const currentState = this.sidenavStateSubject.getValue();
    this.sidenavStateSubject.next(!currentState);
  }

  getState(): boolean {
    return this.sidenavStateSubject.getValue();
  }

  // ai chat histories
  initialAiChatHistories(histories: ChatbotHistorySideNavItem[]) {
    this.aiChatHistories.next(histories);
  }

  addAiChatHistory(history: ChatbotHistorySideNavItem) {
    const histories = this.aiChatHistories.getValue();
    histories.unshift(history); // Add the new item at the beginning
    this.aiChatHistories.next(histories);
  }
}
