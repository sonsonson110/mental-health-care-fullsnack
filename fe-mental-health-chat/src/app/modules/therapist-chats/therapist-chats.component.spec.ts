import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistChatsComponent } from './therapist-chats.component';

describe('TherapistChatsComponent', () => {
  let component: TherapistChatsComponent;
  let fixture: ComponentFixture<TherapistChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapistChatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapistChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
