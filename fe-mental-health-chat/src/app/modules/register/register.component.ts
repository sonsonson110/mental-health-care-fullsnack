import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
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
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { IssueTag } from '../../core/models/common/issue-tag.model';
import { TherapistEducation } from '../../core/models/common/therapist-education.model';
import { TherapistCertification } from '../../core/models/common/therapist-certification.model';
import { TherapistExperience } from '../../core/models/common/therapist-experience.model';
import { UsersApiService } from '../../core/api-services/users-api.service';
import { genders } from '../../core/constants/gender.constant';
import { TagsApiService } from '../../core/api-services/tags-api.service';
import { ProblemDetail } from '../../core/models/common/problem-detail.model';
import { ErrorDisplayComponent } from '../../shared/components/error-display/error-display.component';
import { Router } from '@angular/router';
import { CreateUserRequest } from '../../core/models/modules/register/create-user-request.model';
import { Gender } from '../../core/models/enums/gender.enum';
import { FilesApiService } from '../../core/api-services/files-api.service';
import { switchMap } from 'rxjs';
import {
  TherapistInformationInputComponent
} from '../../shared/components/therapist-information-input/therapist-information-input.component';
import { parseBackendConsumableDate } from '../../shared/utils/date-parse';
import { passwordRequirementsValidator } from '../../shared/validators/password-requirement.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
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
    ErrorDisplayComponent,
    TherapistInformationInputComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('chipInput') chipInput!: ElementRef<HTMLInputElement>;

  allIssueTags: IssueTag[] = [];
  selectedIssueTags: IssueTag[] = [];
  educations: TherapistEducation[] = [];
  certifications: TherapistCertification[] = [];
  experiences: TherapistExperience[] = [];
  description: string | null = null;
  isTherapist = false;

  isMdBreakpoint = false;

  // constant
  genders = genders;

  // form groups
  identityFormGroup;
  personalInfoFormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  error: ProblemDetail | null = null;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private usersService: UsersApiService,
    private tagsService: TagsApiService,
    private filesService: FilesApiService,
    formBuilder: FormBuilder
  ) {
    // Observe screen size to determine if we should show the side nav
    this.breakpointObserver.observe('(min-width: 768px)').subscribe(result => {
      this.isMdBreakpoint = result.matches;
    });
    // set up form groups
    this.identityFormGroup = formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordRequirementsValidator()]],
    });
    this.personalInfoFormGroup = formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      phoneNumber: [null, Validators.pattern('^[0-9]*$')],
      gender: [null as number | null, Validators.required],
      bio: [null],
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

  onSelectedIssueTagsChange(tags: IssueTag[]): void {
    this.selectedIssueTags = tags;
  }

  onEducationsChange(educations: TherapistEducation[]): void {
    this.educations = educations;
  }

  onCertificationsChange(certifications: TherapistCertification[]): void {
    this.certifications = certifications;
  }

  onExperiencesChange(experiences: TherapistExperience[]): void {
    this.experiences = experiences;
  }

  onDescriptionChange(description: string | null): void {
    this.description = description;
  }

  onIsTherapistChange(isTherapist: boolean): void {
    this.isTherapist = isTherapist;
  }

  registrable() {
    return this.identityFormGroup.valid && this.personalInfoFormGroup.valid;
  }

  onRegisterClick(stepper: MatStepper) {
    this.error = null;

    // convert to the date format that the backend expects
    const dateOfBirth = parseBackendConsumableDate(
      this.personalInfoFormGroup.value.dateOfBirth!
    );
    const educations = this.isTherapist
      ? this.educations.map(e => {
          e.startDate = parseBackendConsumableDate(e.startDate);
          e.endDate = e.endDate && parseBackendConsumableDate(e.endDate);
          return e;
        })
      : [];
    const certifications = this.isTherapist
      ? this.certifications.map(e => {
          e.dateIssued = parseBackendConsumableDate(e.dateIssued);
          e.expirationDate =
            e.expirationDate && parseBackendConsumableDate(e.expirationDate);
          return e;
        })
      : [];
    const experiences = this.isTherapist
      ? this.experiences.map(e => {
          e.startDate = parseBackendConsumableDate(e.startDate);
          e.endDate = e.endDate && parseBackendConsumableDate(e.endDate);
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
      description: this.isTherapist ? this.description : null,
      issueTagIds: this.isTherapist ? this.selectedIssueTags.map(e => e.id) : [],
      avatarName: null,
      bio: this.personalInfoFormGroup.value.bio!,
    };

    const createUser$ = this.selectedFile
      ? this.filesService.uploadImage(this.selectedFile).pipe(
          switchMap(resp => {
            createUserRequest.avatarName = resp.fileName;
            return this.usersService.register(createUserRequest);
          })
        )
      : this.usersService.register(createUserRequest);

    createUser$.subscribe({
      error: (problemDetail: ProblemDetail) => (this.error = problemDetail),
      next: () => {
        stepper.next();
        stepper.steps.forEach(e => (e.editable = false));
      },
    });
  }
  onFinishClick() {
    this.router.navigate(['/login']);
  }
}
