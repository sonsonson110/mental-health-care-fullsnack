import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiChatHistorySideNavComponent } from './ai-chat-history-side-nav.component';

describe('AiChatHistorySideNavComponent', () => {
  let component: AiChatHistorySideNavComponent;
  let fixture: ComponentFixture<AiChatHistorySideNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiChatHistorySideNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiChatHistorySideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
