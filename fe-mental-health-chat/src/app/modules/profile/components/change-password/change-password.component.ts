import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import {
  AbstractControl,
  FormControl,
  FormGroup, FormGroupDirective,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { UsersApiService } from '../../../../core/api-services/users-api.service';
import { ToastrService } from 'ngx-toastr';
import { ProblemDetail } from '../../../../core/models/common/problem-detail.model';
import { finalize } from 'rxjs';
import { ErrorDisplayComponent } from '../../../../shared/components/error-display/error-display.component';
import { passwordRequirementsValidator } from '../../../../shared/validators/password-requirement.validator';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    CommonModule,
    ErrorDisplayComponent
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  isSubmitting = false;
  error: ProblemDetail | null = null;

  form = new FormGroup(
    {
      oldPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      newPassword: new FormControl('', [
        Validators.required,
        passwordRequirementsValidator(),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: [this.passwordMatchValidator, this.differentPasswordValidator] }
  );

  constructor(
    private usersService: UsersApiService,
    private toastr: ToastrService
  ) {}

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  differentPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const oldPassword = control.get('oldPassword');
    const newPassword = control.get('newPassword');

    if (newPassword?.errors?.['passwordRequirements']) return null;

    if (
      oldPassword &&
      newPassword &&
      oldPassword.value &&
      newPassword.value &&
      oldPassword.value === newPassword.value
    ) {
      newPassword.setErrors({ ...newPassword.errors, samePreviousPassword: true });
      return { samePreviousPassword: true };
    }

    // Clear the samePreviousPassword error if passwords are different
    if (newPassword?.errors?.['samePreviousPassword']) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { samePreviousPassword, ...otherErrors } = newPassword.errors;
      newPassword.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
    }

    return null;
  }

  onSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    this.isSubmitting = true;
    this.error = null;

    if (this.form.valid) {
      this.usersService
        .changePassword({
          oldPassword: this.form.value.oldPassword!,
          newPassword: this.form.value.newPassword!,
        })
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: () => {
            this.toastr.success('Password changed successfully');
            // this prevents the form from raising required error after reset
            form.reset();
            formGroupDirective.resetForm();
          },
          error: (problemDetail: ProblemDetail) => {
            this.error = problemDetail;
          },
        });
    }
  }
}
