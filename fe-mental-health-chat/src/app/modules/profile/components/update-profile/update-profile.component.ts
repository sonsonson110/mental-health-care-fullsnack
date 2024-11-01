import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { genders } from '../../../../core/constants/gender.constant';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { UserDetailResponse } from '../../../../core/models/modules/profile/user-detail-response.model';
import { IssueTag } from '../../../../core/models/common/issue-tag.model';
import { IssueTagInputComponent } from '../../../../shared/components/issue-tag-input/issue-tag-input.component';
import { TagsService } from '../../../../core/services/tags.service';
import { TherapistEducation } from '../../../../core/models/common/therapist-education.model';
import { TherapistCertification } from '../../../../core/models/common/therapist-certification.model';
import { TherapistExperience } from '../../../../core/models/common/therapist-experience.model';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TherapistInformationInputComponent } from '../../../../shared/components/therapist-information-input/therapist-information-input.component';
import { UsersService } from '../../../../core/services/users.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Gender } from '../../../../core/models/enums/gender.enum';
import { FilesService } from '../../../../core/services/files.service';
import { parseBackendConsumableDate } from '../../../../shared/utils/date-parse.utils';
import { UpdateUserRequest } from '../../../../core/models/modules/profile/update-user-request.model';
import { finalize, switchMap } from 'rxjs';
import { ProblemDetail } from '../../../../core/models/common/problem-detail.model';
import { ErrorDisplayComponent } from '../../../../shared/components/error-display/error-display.component';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environment/dev.environment';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    MatSelectModule,
    IssueTagInputComponent,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    TherapistInformationInputComponent,
    ErrorDisplayComponent,
  ],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss',
})
export class UpdateProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  isLoading = true;
  isUpdating = false;
  error: ProblemDetail | null = null;

  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  //region Data and forms
  readonly genders = genders;
  userDetail!: UserDetailResponse;

  allIssueTags: IssueTag[] = [];
  selectedIssueTags: IssueTag[] = [];
  educations: TherapistEducation[] = [];
  certifications: TherapistCertification[] = [];
  experiences: TherapistExperience[] = [];
  description: string | null = null;
  isTherapist = false;

  bioFormControl!: FormControl;
  personalInfoFormGroup!: FormGroup;

  // therapist forms
  therapistEducationFormGroup: FormGroup;
  therapistCertificationFormGroup: FormGroup;
  therapistExperienceFormGroup: FormGroup;
  therapistDescriptionForm: FormControl;

  //endregion

  constructor(
    private tagsService: TagsService,
    private usersService: UsersService,
    private filesService: FilesService,
    private toastr: ToastrService,
    formBuilder: FormBuilder
  ) {
    this.therapistEducationFormGroup = formBuilder.group({
      institution: ['', Validators.required],
      degree: [null],
      major: [null],
      startDate: ['', Validators.required],
      endDate: [null],
    });
    this.therapistCertificationFormGroup = formBuilder.group({
      name: ['', Validators.required],
      issuingOrganization: ['', Validators.required],
      dateIssued: ['', Validators.required],
      expirationDate: [null],
      referenceUrl: [null],
    });
    this.therapistDescriptionForm = formBuilder.control(null);
    this.therapistExperienceFormGroup = formBuilder.group({
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
    this.usersService.getUserDetail().subscribe(userDetail => {
      this.userDetail = userDetail;
      this.previewUrl = this.userDetail.avatarName
        ? `${environment.avatarUrl}/${this.userDetail.avatarName}`
        : this.getDefaultAvatar();
      this.initializeUserDetailData();
      this.isLoading = false;
      console.log(this.previewUrl)
    });
  }

  private initializeUserDetailData(): void {
    this.bioFormControl = new FormControl(this.userDetail.bio, [Validators.required]);

    this.personalInfoFormGroup = new FormGroup({
      firstName: new FormControl(this.userDetail.firstName, [Validators.required]),
      lastName: new FormControl(this.userDetail.lastName, [Validators.required]),
      email: new FormControl(this.userDetail.email, [
        Validators.required,
        Validators.email,
      ]),
      phoneNumber: new FormControl(this.userDetail.phoneNumber, [
        Validators.pattern('^[0-9]*$'),
      ]),
      dateOfBirth: new FormControl(this.userDetail.dateOfBirth, [Validators.required]),
      gender: new FormControl(this.userDetail.gender, [Validators.required]),
    });

    this.isTherapist = this.userDetail.isTherapist;
    this.selectedIssueTags = this.userDetail.issueTags;
    this.educations = this.userDetail.educations;
    this.experiences = this.userDetail.experiences;
    this.certifications = this.userDetail.certifications;
  }

  //region Avatar methods
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
    return this.userDetail.gender === Gender.FEMALE
      ? 'assets/default-avatar/girl.png'
      : 'assets/default-avatar/boy.png';
  }

  //endregion

  //region therapist forms
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

  //endregion

  onSaveChanges(): void {
    this.isUpdating = true;
    this.error = null;

    // convert to the date format that the backend expects
    // also keep the original therapist values if therapist toggle is switched off
    const dateOfBirth = parseBackendConsumableDate(
      this.personalInfoFormGroup.value.dateOfBirth!
    );
    const educations = this.educations.map(e => {
          e.startDate = parseBackendConsumableDate(e.startDate);
          e.endDate = e.endDate && parseBackendConsumableDate(e.endDate);
          return e;
        });
    const certifications = this.certifications.map(e => {
          e.dateIssued = parseBackendConsumableDate(e.dateIssued);
          e.expirationDate =
            e.expirationDate && parseBackendConsumableDate(e.expirationDate);
          return e;
        });
    const experiences = this.experiences.map(e => {
          e.startDate = parseBackendConsumableDate(e.startDate);
          e.endDate = e.endDate && parseBackendConsumableDate(e.endDate);
          return e;
        });

    const updateUserRequest: UpdateUserRequest = {
      avatarName: null,
      bio: this.personalInfoFormGroup.value.bio!,
      firstName: this.personalInfoFormGroup.value.firstName!,
      lastName: this.personalInfoFormGroup.value.lastName!,
      gender: this.personalInfoFormGroup.value.gender!,
      dateOfBirth: dateOfBirth,
      phoneNumber: this.personalInfoFormGroup.value.phoneNumber!,
      email: this.personalInfoFormGroup.value.email!,
      isTherapist: this.isTherapist,
      description: this.description,
      issueTagIds: this.selectedIssueTags.map(e => e.id),
      educations: educations,
      experiences: experiences,
      certifications: certifications,
    };

    const updateUser$ = this.selectedFile
      ? this.filesService.uploadAvatar(this.selectedFile).pipe(
          switchMap(resp => {
            updateUserRequest.avatarName = resp.fileName;
            return this.usersService.updateUser(updateUserRequest);
          })
        )
      : this.usersService.updateUser(updateUserRequest);

    updateUser$
      .pipe(
        finalize(() => {
          this.isUpdating = false;
        })
      )
      .subscribe({
        error: (problemDetail: ProblemDetail) => {
          this.error = problemDetail;
          this.toastr.error(problemDetail.detail);
        },
        next: resp => {
          this.userDetail = resp;
          this.toastr.success('User updated!');
        },
      });
  }
}
