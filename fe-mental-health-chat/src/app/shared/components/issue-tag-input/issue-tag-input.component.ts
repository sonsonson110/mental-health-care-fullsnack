import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { IssueTag } from '../../../core/models/common/issue-tag.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-issue-tag-input',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './issue-tag-input.component.html',
  styleUrl: './issue-tag-input.component.scss',
})
export class IssueTagInputComponent implements OnInit {
  @Input() disabled = false;
  @Input() appearance: 'fill' | 'outline' = 'fill';
  @Input() allIssueTags: IssueTag[] = [];
  @Input() selectedIssueTags: IssueTag[] = [];

  @Output() selectedIssueTagsChange = new EventEmitter<IssueTag[]>();

  @ViewChild('chipInput') chipInput!: ElementRef<HTMLInputElement>;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  currentIssueTag = new FormControl('');
  filteredIssueTags: IssueTag[] = [];

  ngOnInit(): void {
    this.currentIssueTag.valueChanges.subscribe(() => {
      const current = this.currentIssueTag.value?.toLowerCase() || '';
      const issueTagsPreFiltered = this.allIssueTags.filter(
        e => !this.selectedIssueTags.map(tag => tag.id).includes(e.id)
      );

      this.filteredIssueTags = current
        ? issueTagsPreFiltered.filter(
            issueTag =>
              (issueTag.name.toLowerCase().includes(current) ||
                issueTag.shortName?.toLowerCase().includes(current)) &&
              this.selectedIssueTags.every(tag => tag.id !== issueTag.id)
          )
        : issueTagsPreFiltered;
    });
  }

  remove(id: string): void {
    const index = this.selectedIssueTags.findIndex(e => e.id === id);
    if (index >= 0) {
      this.selectedIssueTags.splice(index, 1);
      this.selectedIssueTagsChange.emit(this.selectedIssueTags);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const newIssueTag = this.allIssueTags.find(e => e.id === event.option.value);
    if (newIssueTag) {
      this.selectedIssueTags.push(newIssueTag);
      this.selectedIssueTagsChange.emit(this.selectedIssueTags);
    }
    this.chipInput.nativeElement.value = '';
    this.currentIssueTag.setValue('');
  }
}