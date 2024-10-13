import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TherapistHistorySidenavItem } from '../../../core/models/modules/therapist-chats/therapist-history-sidenav-item.model';

@Injectable({
  providedIn: 'root'
})
export class SidenavStateService {
  private therapistChatHistories = new BehaviorSubject<TherapistHistorySidenavItem[]>([]);
  therapistChatHistories$ = this.therapistChatHistories.asObservable();

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
  initialTherapistChatHistories(histories: TherapistHistorySidenavItem[]) {
    this.therapistChatHistories.next(histories);
  }
}
