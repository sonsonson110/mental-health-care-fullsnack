import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CreateUpdatePublicSessionRequest } from '../../../../core/models/modules/my-public-session/create-update-public-session-request.model';
import { generateTimeOptions } from '../../../../shared/utils/generate-time-options';
import { validateTimeRange } from '../../../../shared/validators/time-range.validator';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { publicSessionTypes } from '../../../../core/constants/public-session-type.constant';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MyPublicSessionsStateService } from '../../services/my-public-sessions-state.service';
import { format } from 'date-fns';
import { convert12to24 } from '../../../../shared/utils/date-parse';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ParseImageUrlPipe } from '../../../../shared/pipes/parse-image-url.pipe';
import { IssueTag } from '../../../../core/models/common/issue-tag.model';
import { IssueTagInputComponent } from '../../../../shared/components/issue-tag-input/issue-tag-input.component';

@Component({
  selector: 'app-create-update-public-session-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    CommonModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    IssueTagInputComponent,
  ],
  providers: [ParseImageUrlPipe],
  templateUrl: './create-update-public-session-dialog.component.html',
  styleUrl: './create-update-public-session-dialog.component.scss',
})
export class CreateUpdatePublicSessionDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CreateUpdatePublicSessionDialogComponent>);
  readonly data: CreateUpdatePublicSessionRequest | null = inject(MAT_DIALOG_DATA);

  readonly mode = this.data?.id ? 'update' : 'create';
  readonly capitalizedMode = this.mode.charAt(0).toUpperCase() + this.mode.slice(1);
  readonly formFieldAppearance = this.mode === 'create' ? 'fill' : 'outline';

  issueTags: IssueTag[] = [];
  selectedIssueTags: IssueTag[] = [];

  readonly timeOptions: string[] = generateTimeOptions();
  publicSessionTypes = publicSessionTypes;

  isSubmitting = false;

  previewUrl?: string | null = null;
  readonly MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

  sessionFormGroup = new FormGroup(
    {
      title: new FormControl(this.data?.title ?? '', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      description: new FormControl(this.data?.description ?? '', [
        Validators.required,
        Validators.maxLength(500),
      ]),
      thumbnailName: new FormControl(this.data?.thumbnailName),
      thumbnailFile: new FormControl<File | null>(null),
      date: new FormControl(this.data?.date, [Validators.required]),
      startTime: new FormControl(this.data?.startTime ?? '', [Validators.required]),
      endTime: new FormControl(this.data?.endTime ?? '', [Validators.required]),
      location: new FormControl(this.data?.location ?? '', [
        Validators.required,
        Validators.maxLength(200),
      ]),
      type: new FormControl(this.data?.type ?? null, [Validators.required]),
      isCancelled: new FormControl(this.data?.isCancelled ?? false),
    },
    { validators: validateTimeRange() }
  );

  constructor(
    private stateService: MyPublicSessionsStateService,
    private toastr: ToastrService,
    parseImageUrlPipe: ParseImageUrlPipe
  ) {
    this.previewUrl =
      this.data?.thumbnailName && parseImageUrlPipe.transform(this.data?.thumbnailName);
    this.stateService.loadTags().subscribe(tags => {
      this.issueTags = tags;

      this.data?.issueTagIds?.forEach(tag => {
        const foundTag = this.issueTags.find(t => t.id === tag);
        if (foundTag) {
          this.selectedIssueTags.push(foundTag);
        }
      });
    });
  }

  ngOnInit(): void {
    this.stateService.loadTags();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];

      // Check file size
      if (file.size > this.MAX_FILE_SIZE) {
        this.toastr.error('Image size should not exceed 2MB');
        input.value = ''; // Clear the input
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        this.toastr.error('Please select an image file');
        input.value = '';
        return;
      }

      // Update form control and preview
      this.sessionFormGroup.patchValue({ thumbnailFile: file });

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.previewUrl = null;
    this.sessionFormGroup.patchValue({
      thumbnailFile: null,
      thumbnailName: null,
    });
  }

  onSubmit(): void {
    if (this.sessionFormGroup.valid) {
      this.isSubmitting = true;

      const request: CreateUpdatePublicSessionRequest = {
        id: this.data?.id,
        title: this.sessionFormGroup.value.title!,
        description: this.sessionFormGroup.value.description!,
        thumbnailName: this.sessionFormGroup.value.thumbnailName!,
        date: format(this.sessionFormGroup.value.date!, 'yyyy-MM-dd'),
        startTime: convert12to24(this.sessionFormGroup.value.startTime!),
        endTime: convert12to24(this.sessionFormGroup.value.endTime!),
        location: this.sessionFormGroup.value.location!,
        type: this.sessionFormGroup.value.type!,
        isCancelled: this.sessionFormGroup.value.isCancelled ?? false,
        issueTagIds: this.selectedIssueTags.map(tag => tag.id),
      };

      this.stateService
        .submitPublicSessionWithImage(
          request,
          this.mode,
          this.sessionFormGroup.value.thumbnailFile ?? null
        )
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe(() => this.dialogRef.close());
    }
  }
}
