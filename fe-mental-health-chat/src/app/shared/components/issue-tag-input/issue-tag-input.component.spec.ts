import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueTagInputComponent } from './issue-tag-input.component';

describe('IssueTagInputComponent', () => {
  let component: IssueTagInputComponent;
  let fixture: ComponentFixture<IssueTagInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueTagInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueTagInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
