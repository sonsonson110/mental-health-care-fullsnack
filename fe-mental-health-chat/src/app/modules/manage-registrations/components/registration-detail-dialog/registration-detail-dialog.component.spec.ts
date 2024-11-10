import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationDetailDialogComponent } from './registration-detail-dialog.component';

describe('RegistrationDetailDialogComponent', () => {
  let component: RegistrationDetailDialogComponent;
  let fixture: ComponentFixture<RegistrationDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
