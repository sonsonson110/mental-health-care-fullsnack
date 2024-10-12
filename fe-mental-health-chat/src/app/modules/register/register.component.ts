import { CommonModule } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, computed, model, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';

import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { IssueTag } from '../../core/models/domain/issue-tag.domain';
import { CreateEducationRequest } from '../../core/models/modules/register/create-education-request.model';
import { CreateCertificationRequest } from '../../core/models/modules/register/create-certification-request.model';
import { CreateExperienceRequest } from '../../core/models/modules/register/create-experience-request.model';
import { UserService } from '../../core/services/user.service';
import { genders } from '../../core/constants/gender.constant';
import { TagsService } from '../../core/services/tags.service';
import { ProblemDetail } from '../../core/models/problem-detail.model';
import { ErrorDisplayComponent } from '../../shared/components/error-display/error-display.component';
import { Router } from '@angular/router';
import { CreateUserRequest } from '../../core/models/modules/register/create-user-request.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDividerModule,
    MatListModule,
    ErrorDisplayComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  // issue tags input
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentIssueTag = model('');
  readonly issueTags = signal<IssueTag[]>([]);
  allIssueTags: IssueTag[] = [];
  readonly filteredIssueTags = computed(() => {
    const current = this.currentIssueTag().toLowerCase();
    const issueTagsPreFiltered = this.allIssueTags.filter(
      e =>
        !this.issueTags()
          .map(e => e.id)
          .includes(e.id)
    );
    return current
      ? issueTagsPreFiltered.filter(
          issueTag =>
            (issueTag.name.toLowerCase().includes(current) ||
              issueTag.shortName?.toLowerCase().includes(current)) &&
            this.issueTags().every(e => e.id !== issueTag.id)
        )
      : issueTagsPreFiltered;
  });

  isMdBreakpoint = false;
  isTherapist = false;

  // constant
  genders = genders;

  // form groups
  identityFormGroup;
  personalInfoFormGroup;
  therapistEducationFormGroup;
  therapistCertificationFormGroup;
  therapistBioForm;
  therapistExperienceFormGroup;

  // added to preview items
  educations = signal<CreateEducationRequest[]>([]);
  certifications = signal<CreateCertificationRequest[]>([]);
  experiences = signal<CreateExperienceRequest[]>([]);

  error: ProblemDetail | null = null;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private userService: UserService,
    private tagsService: TagsService,
    _formBuilder: FormBuilder
  ) {
    // Observe screen size to determine if we should show the side nav
    this.breakpointObserver.observe('(min-width: 768px)').subscribe(result => {
      this.isMdBreakpoint = result.matches;
    });
    // set up form groups
    this.identityFormGroup = _formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.personalInfoFormGroup = _formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      phoneNumber: ['', Validators.pattern('^[0-9]*$')],
      gender: [null as number | null, Validators.required],
    });
    this.therapistEducationFormGroup = _formBuilder.group({
      institude: ['', Validators.required],
      degree: [''],
      major: [''],
      startDate: ['', Validators.required],
      endDate: [''],
    });
    this.therapistEducationFormGroup.disable(); // disable by default
    this.therapistCertificationFormGroup = _formBuilder.group({
      name: ['', Validators.required],
      issuingOrganization: ['', Validators.required],
      dateIssued: ['', Validators.required],
      expirationDate: [''],
      referenceUrl: [''],
    });
    this.therapistCertificationFormGroup.disable(); // disable by default
    this.therapistBioForm = _formBuilder.control('');
    this.therapistBioForm.disable(); // disable by default
    this.therapistExperienceFormGroup = _formBuilder.group({
      organization: ['', Validators.required],
      position: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: [''],
    });
    this.therapistExperienceFormGroup.disable(); // disable by default
  }
  ngOnInit(): void {
    this.tagsService.getAll().subscribe(tags => {
      this.allIssueTags = tags;
    });
  }

  onTherapistCheckboxChange() {
    this.isTherapist = !this.isTherapist;
    if (this.isTherapist === false) {
      this.therapistEducationFormGroup.disable();
      this.therapistCertificationFormGroup.disable();
      this.therapistExperienceFormGroup.disable();
      this.therapistBioForm.disable();
    } else {
      this.therapistEducationFormGroup.enable();
      this.therapistCertificationFormGroup.enable();
      this.therapistExperienceFormGroup.enable();
      this.therapistBioForm.enable();
    }
  }

  // region: for issue tags input
  remove(id: string): void {
    this.issueTags.update(issueTags => {
      const index = issueTags.findIndex(e => e.id === id);
      if (index < 0) {
        return issueTags;
      }

      issueTags.splice(index, 1);
      return [...issueTags];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.issueTags.update(issueTags => {
      const newIssueTag = this.allIssueTags.find(e => e.id === event.option.value);
      return newIssueTag !== undefined ? [...issueTags, newIssueTag] : [...issueTags];
    });
    this.currentIssueTag.set('');
    event.option.deselect();
  }
  // endregion

  onAddEducationClick() {
    const education = this.therapistEducationFormGroup
      .value as unknown as CreateEducationRequest;
    this.educations.update(educations => [...educations, education]);
    this.therapistEducationFormGroup.reset();
  }
  onAddCertificationClick() {
    const certification = this.therapistCertificationFormGroup
      .value as unknown as CreateCertificationRequest;
    this.certifications.update(certifications => [...certifications, certification]);
    this.therapistCertificationFormGroup.reset();
  }
  onAddExperienceClick() {
    const experience = this.therapistExperienceFormGroup
      .value as unknown as CreateExperienceRequest;
    this.experiences.update(experiences => [...experiences, experience]);
    this.therapistExperienceFormGroup.reset();
  }

  onRemoveEducationClick(index: number) {
    this.educations.update(educations => {
      educations.splice(index, 1);
      return [...educations];
    });
  }
  onRemoveCertificationClick(index: number) {
    this.certifications.update(certifications => {
      certifications.splice(index, 1);
      return [...certifications];
    });
  }
  onRemoveExperienceClick(index: number) {
    this.experiences.update(experiences => {
      experiences.splice(index, 1);
      return [...experiences];
    });
  }

  registerable() {
    return this.identityFormGroup.valid && this.personalInfoFormGroup.valid;
  }

  onRegisterClick(stepper: MatStepper) {
    this.error = null;

    // convert to the date format that the backend expects
    const dateOfBirth = new Date(this.personalInfoFormGroup.value.dateOfBirth!!)
      .toISOString()
      .split('T')[0];
    const educations = this.isTherapist
      ? this.educations().map(e => {
          e.startDate = new Date(e.startDate).toISOString().split('T')[0];
          e.endDate = e.endDate ? new Date(e.endDate).toISOString().split('T')[0] : null;
          return e;
        })
      : [];
    const certifications = this.isTherapist
      ? this.certifications().map(e => {
          e.dateIssued = new Date(e.dateIssued).toISOString().split('T')[0];
          e.expirationDate = e.expirationDate
            ? new Date(e.expirationDate).toISOString().split('T')[0]
            : null;
          return e;
        })
      : [];
    const experiences = this.isTherapist
      ? this.experiences().map(e => {
          e.startDate = new Date(e.startDate).toISOString().split('T')[0];
          e.endDate = e.endDate ? new Date(e.endDate).toISOString().split('T')[0] : null;
          return e;
        })
      : [];

    const createUserRequest: CreateUserRequest = {
      firstName: this.personalInfoFormGroup.value.firstName!!,
      lastName: this.personalInfoFormGroup.value.lastName!!,
      gender: this.personalInfoFormGroup.value.gender!!,
      dateOfBirth: dateOfBirth,
      phoneNumber: this.personalInfoFormGroup.value.phoneNumber!!,
      email: this.identityFormGroup.value.email!!,
      password: this.identityFormGroup.value.password!!,
      isTherapist: this.isTherapist,
      educations: educations,
      certifications: certifications,
      experiences: experiences,
      bio: this.isTherapist ? this.therapistBioForm.value : null,
      issueTagIds: this.isTherapist ? this.issueTags().map(e => e.id) : [],
    };
    this.userService.register(createUserRequest).subscribe({
      error: (problemDetail: ProblemDetail) => (this.error = problemDetail),
      next: () => {
        stepper.next();
        stepper.steps.forEach(e => e.editable = false);
      },
    });
  }

  onFinishClick() {
    this.router.navigate(['/login']);
  }
}
