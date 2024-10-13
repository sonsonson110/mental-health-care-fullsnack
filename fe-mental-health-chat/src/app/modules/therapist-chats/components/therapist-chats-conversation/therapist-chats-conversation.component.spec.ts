import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistChatsConversationComponent } from './therapist-chats-conversation.component';

describe('TherapistChatsConversationComponent', () => {
  let component: TherapistChatsConversationComponent;
  let fixture: ComponentFixture<TherapistChatsConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapistChatsConversationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapistChatsConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
