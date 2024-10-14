import { TestBed } from '@angular/core/testing';

import { P2pConversationSidenavStateService } from './p2p-conversation-sidenav-state.service';

describe('P2pConversationSidenavStateService', () => {
  let service: P2pConversationSidenavStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(P2pConversationSidenavStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
