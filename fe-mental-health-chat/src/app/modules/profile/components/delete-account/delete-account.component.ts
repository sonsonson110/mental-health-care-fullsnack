import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordRequirementsValidator } from '../../../../shared/validators/password-requirement.validator';
import { ErrorDisplayComponent } from '../../../../shared/components/error-display/error-display.component';
import { CommonModule } from '@angular/common';
import { ProblemDetail } from '../../../../core/models/common/problem-detail.model';
import { UsersApiService } from '../../../../core/api-services/users-api.service';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { AuthApiService } from '../../../../core/api-services/auth-api.service';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ErrorDisplayComponent,
    FormsModule,
    CommonModule,
    MatProgressSpinner
  ],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss',
})
export class DeleteAccountComponent {
  isSubmitting = false;
  error: ProblemDetail | null = null;

  currentPasswordControl = new FormControl('', [
    Validators.required,
    passwordRequirementsValidator(),
  ]);

  constructor(
    private usersService: UsersApiService,
    private toastr: ToastrService,
    private authService: AuthApiService,
  ) {}

  onSubmit() {
    this.isSubmitting = true;
    this.error = null;

    this.usersService
      .deleteUser({ currentPassword: this.currentPasswordControl.value! })
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.toastr.success('Your account has been deleted');
          this.authService.handleLogout();
        },
        error: (error: ProblemDetail) => {
          this.error = error;
        },
      });
  }
}
