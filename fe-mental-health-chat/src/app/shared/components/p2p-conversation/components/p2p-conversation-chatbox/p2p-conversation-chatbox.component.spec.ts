import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2pConversationChatboxComponent } from './p2p-conversation-chatbox.component';

describe('P2pConversationChatboxComponent', () => {
  let component: P2pConversationChatboxComponent;
  let fixture: ComponentFixture<P2pConversationChatboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P2pConversationChatboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(P2pConversationChatboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
