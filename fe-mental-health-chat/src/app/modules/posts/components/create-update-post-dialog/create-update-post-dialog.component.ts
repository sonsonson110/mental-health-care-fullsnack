import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CreateUpdatePostRequest } from '../../../../core/models/modules/posts/create-update-post-request.model';
import { PostsStateService } from '../../services/posts-state.service';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-update-post-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-update-post-dialog.component.html',
  styleUrl: './create-update-post-dialog.component.scss',
})
export class CreateUpdatePostDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CreateUpdatePostDialogComponent>);
  readonly data: CreateUpdatePostRequest | null = inject(MAT_DIALOG_DATA);

  readonly mode = this.data?.id ? 'update' : 'create';
  readonly capitalizedMode = this.mode.charAt(0).toUpperCase() + this.mode.slice(1);
  readonly formFieldAppearance = this.mode === 'create' ? 'fill' : 'outline';

  isSubmitting = false;

  readonly postFormGroup = new FormGroup({
    title: new FormControl(this.data?.title ?? '', [Validators.required]),
    content: new FormControl(this.data?.content ?? '', [Validators.required]),
    isPrivate: new FormControl(this.data?.isPrivate ?? false),
  });

  constructor(private stateService: PostsStateService, private toastr: ToastrService) {}

  onSubmit(): void {
    if (this.postFormGroup.invalid) {
      this.postFormGroup.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const request: CreateUpdatePostRequest = {
      id: this.data?.id,
      title: this.postFormGroup.controls.title.value!,
      content: this.postFormGroup.controls.content.value!,
      isPrivate: this.postFormGroup.controls.isPrivate.value!,
    };

    const ob$ =
      this.mode === 'create'
        ? this.stateService.createPost(request)
        : this.stateService.updatePost(request);

    ob$.pipe(finalize(() => (this.isSubmitting = false))).subscribe(() => {
      this.dialogRef.close(true);
      this.toastr.success(`Post ${this.mode === 'create' ? 'created' : 'updated'} successfully`);
    });
  }
}
