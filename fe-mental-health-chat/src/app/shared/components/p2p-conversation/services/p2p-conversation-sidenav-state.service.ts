import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { P2pConversationSidenavItem } from '../../../../core/models/p2p-conversation-sidenav-item.model';

@Injectable()
export class P2pConversationSidenavStateService {
  private p2pConversationSidenavItems = new BehaviorSubject<P2pConversationSidenavItem[]>([]);
  p2pConversationSidenavItems$ = this.p2pConversationSidenavItems.asObservable();

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
  initialP2pConversationSidenavItem(histories: P2pConversationSidenavItem[]) {
    this.p2pConversationSidenavItems.next(histories);
  }

  addP2pConversationSidenavItem(history: P2pConversationSidenavItem) {
    const histories = this.p2pConversationSidenavItems.getValue();
    histories.unshift(history); // Add the new item at the beginning
    this.p2pConversationSidenavItems.next(histories);
  }
}
