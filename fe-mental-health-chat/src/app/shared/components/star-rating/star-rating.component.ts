import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  template: `
    <div class="star-rating">
      <span
        *ngFor="let star of stars"
        class="star"
        [class.filled]="star <= currentHoverValue || star <= formControl.value"
        (click)="rate(star)"
        (mouseenter)="hover(star)"
        (mouseleave)="reset()"
      >
        ★
      </span>
    </div>
  `,
  styles: [`
    .star-rating {
      display: inline-block;
    }
    .star {
      font-size: 2rem;
      color: #ddd;
      cursor: pointer;
      transition: color 0.2s;
    }
    .star.filled {
      color: gold;
    }
    .star:hover {
      color: rgba(255, 215, 0, 0.7);
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true
    }
  ],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class StarRatingComponent implements ControlValueAccessor {
  @Input() maxStars = 5;

  stars: number[] = [];
  formControl: FormControl = new FormControl(0);
  currentHoverValue = 0;

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.stars = Array(this.maxStars).fill(0).map((_, i) => i + 1);
  }

  // ControlValueAccessor methods
  writeValue(value: number): void {
    this.formControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Rating methods
  rate(value: number): void {
    this.formControl.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  hover(value: number): void {
    this.currentHoverValue = value;
  }

  reset(): void {
    this.currentHoverValue = 0;
  }
}
