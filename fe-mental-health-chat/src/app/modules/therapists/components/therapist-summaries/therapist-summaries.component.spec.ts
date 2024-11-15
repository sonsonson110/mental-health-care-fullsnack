import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistSummariesComponent } from './therapist-summaries.component';

describe('TherapistSummariesComponent', () => {
  let component: TherapistSummariesComponent;
  let fixture: ComponentFixture<TherapistSummariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapistSummariesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapistSummariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
