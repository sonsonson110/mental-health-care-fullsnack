import { Component, Input } from '@angular/core';
import { ProblemDetail } from '../../../core/models/problem-detail.model';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatDividerModule],
  templateUrl: './error-display.component.html',
  styleUrl: './error-display.component.scss'
})
export class ErrorDisplayComponent {
  @Input() error!: ProblemDetail;

  getErrorFields(): string[] {
    return this.error.errors ? Object.keys(this.error.errors) : [];
  }
}
