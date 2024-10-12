import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiChatConversationComponent } from './ai-chat-conversation.component';

describe('AiChatConversationComponent', () => {
  let component: AiChatConversationComponent;
  let fixture: ComponentFixture<AiChatConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiChatConversationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiChatConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
