import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRegistrationsComponent } from './manage-registrations.component';

describe('ManageRegistrationsComponent', () => {
  let component: ManageRegistrationsComponent;
  let fixture: ComponentFixture<ManageRegistrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRegistrationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
