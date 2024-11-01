import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IssueTag } from '../../../core/models/common/issue-tag.model';
import { TherapistEducation } from '../../../core/models/common/therapist-education.model';
import { TherapistCertification } from '../../../core/models/common/therapist-certification.model';
import { TherapistExperience } from '../../../core/models/common/therapist-experience.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { IssueTagInputComponent } from '../issue-tag-input/issue-tag-input.component';

@Component({
  selector: 'app-therapist-information-input',
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    CommonModule,
    IssueTagInputComponent,
  ],
  templateUrl: './therapist-information-input.component.html',
  styleUrl: './therapist-information-input.component.scss',
})
export class TherapistInformationInputComponent implements OnInit {
  @Input() allIssueTags: IssueTag[] = [];
  @Input() selectedIssueTags: IssueTag[] = [];
  @Input() educations: TherapistEducation[] = [];
  @Input() certifications: TherapistCertification[] = [];
  @Input() experiences: TherapistExperience[] = [];
  @Input() description: string | null = null;
  @Input() isTherapist = false;
  @Input() appearance: 'fill' | 'outline' = 'fill';

  @Output() selectedIssueTagsChange = new EventEmitter<IssueTag[]>();
  @Output() educationsChange = new EventEmitter<TherapistEducation[]>();
  @Output() certificationsChange = new EventEmitter<TherapistCertification[]>();
  @Output() experiencesChange = new EventEmitter<TherapistExperience[]>();
  @Output() descriptionChange = new EventEmitter<string | null>();
  @Output() isTherapistChange = new EventEmitter<boolean>();

  therapistEducationFormGroup: FormGroup;
  therapistCertificationFormGroup: FormGroup;
  therapistExperienceFormGroup: FormGroup;
  therapistDescriptionForm: FormControl;

  // form panel state
  isEducationFormPanelOpen = false;
  isCertificationFormPanelOpen = false;
  isExperienceFormPanelOpen = false;

  constructor(private formBuilder: FormBuilder) {
    this.therapistEducationFormGroup = this.formBuilder.group({
      institution: ['', Validators.required],
      degree: [null],
      major: [null],
      startDate: ['', Validators.required],
      endDate: [null],
    });
    this.therapistCertificationFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      issuingOrganization: ['', Validators.required],
      dateIssued: ['', Validators.required],
      expirationDate: [null],
      referenceUrl: [null],
    });
    this.therapistExperienceFormGroup = this.formBuilder.group({
      organization: ['', Validators.required],
      position: ['', Validators.required],
      description: [null],
      startDate: ['', Validators.required],
      endDate: [null],
    });
    this.therapistDescriptionForm = this.formBuilder.control(null);
  }

  ngOnInit(): void {
    this.toggleFormControls(this.isTherapist);
  }

  toggleFormControls(enable: boolean): void {
    const action = enable ? 'enable' : 'disable';
    this.therapistEducationFormGroup[action]();
    this.therapistCertificationFormGroup[action]();
    this.therapistExperienceFormGroup[action]();
    this.therapistDescriptionForm[action]();
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

  onTherapistCheckboxChange(): void {
    this.isTherapist = !this.isTherapist;
    this.isTherapistChange.emit(this.isTherapist);
    this.toggleFormControls(this.isTherapist);
  }

  onSaveEducationClick() {
    const education = this.therapistEducationFormGroup.value as TherapistEducation;
    this.educations.push(education);
    this.educationsChange.emit(this.educations);
    this.therapistEducationFormGroup.reset();
    this.isEducationFormPanelOpen = false;
  }

  onAddCertificationClick() {
    const certification = this.therapistCertificationFormGroup
      .value as TherapistCertification;
    this.certifications.push(certification);
    this.certificationsChange.emit(this.certifications);
    this.therapistCertificationFormGroup.reset();
    this.isCertificationFormPanelOpen = false;
  }

  onAddExperienceClick() {
    const experience = this.therapistExperienceFormGroup.value as TherapistExperience;
    this.experiences.push(experience);
    this.experiencesChange.emit(this.experiences);
    this.therapistExperienceFormGroup.reset();
    this.isEducationFormPanelOpen = false;
  }

  onRemoveEducationClick(index: number) {
    this.educations.splice(index, 1);
    this.educationsChange.emit(this.educations);
  }

  onRemoveCertificationClick(index: number) {
    this.certifications.splice(index, 1);
    this.certificationsChange.emit(this.certifications);
  }

  onRemoveExperienceClick(index: number) {
    this.experiences.splice(index, 1);
    this.experiencesChange.emit(this.experiences);
  }
}
