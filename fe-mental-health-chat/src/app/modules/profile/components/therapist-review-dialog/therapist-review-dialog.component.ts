import { Component, inject, OnInit } from '@angular/core';
import { TherapistRegistrationResponse } from '../../../../core/models/common/therapist-registration-response.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ParseAvatarUrlPipe } from '../../../../shared/pipes/parse-avatar-url.pipe';
import { StarRatingComponent } from '../../../../shared/components/star-rating/star-rating.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReviewsApiService } from '../../../../core/api-services/reviews-api.service';
import { finalize } from 'rxjs';
import { TherapistReviewResponse } from '../../../../core/models/modules/profile/therapist-review-response.model';
import { CreateUpdateTherapistReviewRequest } from '../../../../core/models/modules/profile/create-update-therapist-review-request.model';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-therapist-review-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    NgOptimizedImage,
    ParseAvatarUrlPipe,
    StarRatingComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './therapist-review-dialog.component.html',
  styleUrl: './therapist-review-dialog.component.scss',
})
export class TherapistReviewDialogComponent implements OnInit {
  isLoading = true;
  isSubmitting = false;

  readonly data: TherapistRegistrationResponse = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<TherapistReviewDialogComponent>);

  review: TherapistReviewResponse | null = null;

  reviewForm = new FormGroup({
    rating: new FormControl(0, [Validators.min(1), Validators.max(5)]),
    comment: new FormControl('', [
      Validators.maxLength(500),
      Validators.minLength(16),
      Validators.required,
    ]),
  });

  constructor(
    private reviewsApiService: ReviewsApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.reviewsApiService
      .getTherapistReviewByTherapistId(this.data.therapist.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(review => {
        if (review) {
          this.review = review;
          this.reviewForm.patchValue({
            rating: review.rating,
            comment: review.comment,
          });
        }
      });
  }

  onSubmitClick() {
    if (this.reviewForm.invalid) return;

    this.isSubmitting = true;

    const requestBody: CreateUpdateTherapistReviewRequest = {
      id: this.review?.id,
      therapistId: this.data.therapist.id,
      rating: this.reviewForm.value.rating!,
      comment: this.reviewForm.value.comment!,
    };

    const apiRequest = this.review?.id
      ? this.reviewsApiService.updateTherapistReview(requestBody)
      : this.reviewsApiService.createTherapistReview(requestBody);

    apiRequest.pipe(finalize(() => (this.isSubmitting = false))).subscribe(() => {
      this.toastr.success('Review saved successfully');
      this.dialogRef.close();
    });
  }
}
