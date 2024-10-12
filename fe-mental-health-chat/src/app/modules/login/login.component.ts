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
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ProblemDetail } from '../../core/models/problem-detail.model';

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
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  serverError = '';
  isLoggingIn = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.isLoggingIn = true;
    this.serverError = '';

    this.authService
      .login({
        email: this.loginForm.value.email!!,
        password: this.loginForm.value.password!!,
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
