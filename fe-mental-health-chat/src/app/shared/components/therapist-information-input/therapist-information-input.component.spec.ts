import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistInformationInputComponent } from './therapist-information-input.component';

describe('TherapistInformationInputComponent', () => {
  let component: TherapistInformationInputComponent;
  let fixture: ComponentFixture<TherapistInformationInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapistInformationInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapistInformationInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
