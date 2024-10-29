import { CommonModule } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  computed,
  ElementRef,
  model,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
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
import { IssueTag } from '../../core/models/issue-tag.model';
import { CreateEducationRequest } from '../../core/models/modules/register/create-education-request.model';
import { CreateCertificationRequest } from '../../core/models/modules/register/create-certification-request.model';
import { CreateExperienceRequest } from '../../core/models/modules/register/create-experience-request.model';
import { UsersService } from '../../core/services/users.service';
import { genders } from '../../core/constants/gender.constant';
import { TagsService } from '../../core/services/tags.service';
import { ProblemDetail } from '../../core/models/problem-detail.model';
import { ErrorDisplayComponent } from '../../shared/components/error-display/error-display.component';
import { Router } from '@angular/router';
import { CreateUserRequest } from '../../core/models/modules/register/create-user-request.model';
import { Gender } from '../../core/models/enums/gender.enum';
import { FilesService } from '../../core/services/files.service';
import { switchMap } from 'rxjs';

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
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('chipInput') chipInput!: ElementRef<HTMLInputElement>;

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
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  therapistEducationFormGroup;
  therapistCertificationFormGroup;
  therapistDescriptionForm;
  therapistExperienceFormGroup;

  // preview items
  educations = signal<CreateEducationRequest[]>([]);
  certifications = signal<CreateCertificationRequest[]>([]);
  experiences = signal<CreateExperienceRequest[]>([]);

  // form panel state
  isEducationFormPanelOpen = false;
  isCertificationFormPanelOpen = false;
  isExperienceFormPanelOpen = false;

  error: ProblemDetail | null = null;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private userService: UsersService,
    private tagsService: TagsService,
    private filesService: FilesService,
    _formBuilder: FormBuilder
  ) {
    // Observe screen size to determine if we should show the side nav
    this.breakpointObserver.observe('(min-width: 768px)').subscribe(result => {
      this.isMdBreakpoint = result.matches;
    });
    // set up form groups
    this.identityFormGroup = _formBuilder.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.personalInfoFormGroup = _formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      phoneNumber: [null, Validators.pattern('^[0-9]*$')],
      gender: [null as number | null, Validators.required],
      bio: [null],
    });
    this.therapistEducationFormGroup = _formBuilder.group({
      institution: ['', Validators.required],
      degree: [null],
      major: [null],
      startDate: ['', Validators.required],
      endDate: [null],
    });
    this.therapistCertificationFormGroup = _formBuilder.group({
      name: ['', Validators.required],
      issuingOrganization: ['', Validators.required],
      dateIssued: ['', Validators.required],
      expirationDate: [null],
      referenceUrl: [null],
    });
    this.therapistDescriptionForm = _formBuilder.control(null);
    this.therapistExperienceFormGroup = _formBuilder.group({
      organization: ['', Validators.required],
      position: ['', Validators.required],
      description: [null],
      startDate: ['', Validators.required],
      endDate: [null],
    });
  }

  ngOnInit(): void {
    this.tagsService.getAll().subscribe(tags => {
      this.allIssueTags = tags;
    });
    // Subscribe to gender changes to update the avatar preview
    this.personalInfoFormGroup.get('gender')?.valueChanges.subscribe(() => {
      if (!this.selectedFile) {
        this.updatePreview();
      }
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.updatePreview();
    }
  }

  updatePreview(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = e => {
        this.previewUrl = e.target?.result || this.getDefaultAvatar();
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.previewUrl = this.getDefaultAvatar();
    }
  }

  getDefaultAvatar(): string {
    return this.personalInfoFormGroup.controls.gender?.value === Gender.FEMALE
      ? 'assets/default-avatar/girl.png'
      : 'assets/default-avatar/boy.png';
  }

  onTherapistCheckboxChange() {
    this.isTherapist = !this.isTherapist;
    const action = this.isTherapist ? 'enable' : 'disable';
    this.therapistEducationFormGroup[action]();
    this.therapistCertificationFormGroup[action]();
    this.therapistExperienceFormGroup[action]();
    this.therapistDescriptionForm[action]();
  }

  // region tags methods
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
    this.chipInput.nativeElement.value = '';
    event.option.deselect();
  }

  onSaveEducationClick() {
    const education = this.therapistEducationFormGroup
      .value as unknown as CreateEducationRequest;
    this.educations.update(educations => [...educations, education]);
    this.therapistEducationFormGroup.reset();
    this.isEducationFormPanelOpen = false;
  }

  onAddCertificationClick() {
    const certification = this.therapistCertificationFormGroup
      .value as unknown as CreateCertificationRequest;
    this.certifications.update(certifications => [...certifications, certification]);
    this.therapistCertificationFormGroup.reset();
    this.isCertificationFormPanelOpen = false;
  }

  onAddExperienceClick() {
    const experience = this.therapistExperienceFormGroup
      .value as unknown as CreateExperienceRequest;
    this.experiences.update(experiences => [...experiences, experience]);
    this.therapistExperienceFormGroup.reset();
    this.isExperienceFormPanelOpen = false;
  }

  onEducationFormPanelToggle() {
    this.isEducationFormPanelOpen = !this.isEducationFormPanelOpen;
  }

  onExperienceFormPanelToggle() {
    this.isExperienceFormPanelOpen = !this.isExperienceFormPanelOpen;
  }

  onCertificationFormPanelToggle() {
    this.isCertificationFormPanelOpen = !this.isCertificationFormPanelOpen;
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

  registrable() {
    return this.identityFormGroup.valid && this.personalInfoFormGroup.valid;
  }

  onRegisterClick(stepper: MatStepper) {
    this.error = null;

    // convert to the date format that the backend expects
    const dateOfBirth = this.parseBackendConsumableDate(
      this.personalInfoFormGroup.value.dateOfBirth!
    );
    const educations = this.isTherapist
      ? this.educations().map(e => {
          e.startDate = this.parseBackendConsumableDate(e.startDate);
          e.endDate = e.endDate && this.parseBackendConsumableDate(e.endDate);
          return e;
        })
      : [];
    const certifications = this.isTherapist
      ? this.certifications().map(e => {
          e.dateIssued = this.parseBackendConsumableDate(e.dateIssued);
          e.expirationDate =
            e.expirationDate && this.parseBackendConsumableDate(e.expirationDate);
          return e;
        })
      : [];
    const experiences = this.isTherapist
      ? this.experiences().map(e => {
          e.startDate = this.parseBackendConsumableDate(e.startDate);
          e.endDate = e.endDate && this.parseBackendConsumableDate(e.endDate);
          return e;
        })
      : [];

    const createUserRequest: CreateUserRequest = {
      userName: this.identityFormGroup.value.userName!,
      firstName: this.personalInfoFormGroup.value.firstName!,
      lastName: this.personalInfoFormGroup.value.lastName!,
      gender: this.personalInfoFormGroup.value.gender!,
      dateOfBirth: dateOfBirth,
      phoneNumber: this.personalInfoFormGroup.value.phoneNumber!,
      email: this.identityFormGroup.value.email!,
      password: this.identityFormGroup.value.password!,
      isTherapist: this.isTherapist,
      educations: educations,
      certifications: certifications,
      experiences: experiences,
      description: this.isTherapist ? this.therapistDescriptionForm.value : null,
      issueTagIds: this.isTherapist ? this.issueTags().map(e => e.id) : [],
      avatarName: null,
      bio: this.personalInfoFormGroup.value.bio!,
    };

    const avatarUpload$ = this.selectedFile
      ? this.filesService.uploadAvatar(this.selectedFile).pipe(
          switchMap(resp => {
            createUserRequest.avatarName = resp.fileName;
            return this.userService.register(createUserRequest);
          })
        )
      : this.userService.register(createUserRequest);

    avatarUpload$.subscribe({
      error: (problemDetail: ProblemDetail) => (this.error = problemDetail),
      next: () => {
        stepper.next();
        stepper.steps.forEach(e => (e.editable = false));
      },
    });
  }

  private parseBackendConsumableDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  onFinishClick() {
    this.router.navigate(['/login']);
  }
}
