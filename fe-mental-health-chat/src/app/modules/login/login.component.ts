import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthApiService } from '../../core/api-services/auth-api.service';
import { Router } from '@angular/router';
import { ProblemDetail } from '../../core/models/common/problem-detail.model';
import { passwordRequirementsValidator } from '../../shared/validators/password-requirement.validator';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatProgressBarModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  hide = signal(true);

  loginForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password: new FormControl('', [Validators.required, passwordRequirementsValidator()]),
  });
  serverError = '';
  isLoggingIn = false;

  constructor(
    private authService: AuthApiService,
    private router: Router
  ) {}

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    this.isLoggingIn = true;
    this.serverError = '';

    this.authService
      .login({
        userName: this.loginForm.value.userName!,
        password: this.loginForm.value.password!,
      })
      .pipe(finalize(() => (this.isLoggingIn = false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (err: ProblemDetail) => {
          this.serverError = err.detail;
        },
      });
  }

  onRegisterClick = () => this.router.navigate(['/register']);
}
