import { Component, ElementRef, model, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { ParseAvatarUrlPipe } from '../../shared/pipes/parse-avatar-url.pipe';
import { GenderPipe } from '../../shared/pipes/gender.pipe';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { IssueTag } from '../../core/models/common/issue-tag.model';
import { genders } from '../../core/constants/gender.constant';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { experienceLevelOptions } from './constants/experience-level-filter-option.constant';
import { availabilityDateOptions } from './constants/availability-filter-option.constant';
import { IssueTagInputComponent } from '../../shared/components/issue-tag-input/issue-tag-input.component';
import { TherapistSummaryResponse } from '../../core/models/modules/therapists/therapist-summary-response.model';
import { TherapistsDataService } from './services/therapists-data.service';
import { Observable } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TherapistSummariesRequest } from '../../core/models/modules/therapists/therapist-summaries-request.model';
import { ExperienceLevelOption } from '../../core/models/enums/filters/experience-level-option.enum';

@Component({
  selector: 'app-therapists',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    ParseAvatarUrlPipe,
    GenderPipe,
    CommonModule,
    MatChipsModule,
    MatSidenavModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatListModule,
    IssueTagInputComponent,
    MatProgressBarModule,
  ],
  providers: [TherapistsDataService],
  templateUrl: './therapists.component.html',
  styleUrl: './therapists.component.scss',
})
export class TherapistsComponent {
  @ViewChild('genderSelect') genderSelect!: MatSelectionList;
  @ViewChild('dateSelect') dateSelect!: MatSelectionList;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  therapistSummaries$: Observable<TherapistSummaryResponse[]>;
  therapistsLoadingState$: Observable<boolean>;
  allIssueTags: IssueTag[] = [];

  isFilterPanelOpen = false;
  filterPanelMode: 'side' | 'over' = 'over';
  isFilterEnabled = false;

  // region tags properties
  readonly currentIssueTag = model('');
  readonly issueTags = signal<IssueTag[]>([]);

  // region slider properties
  minRating = 0;
  endRating = 5;

  readonly genders = genders;
  readonly experienceLevelOptions = experienceLevelOptions;
  readonly availabilityDateOptions = availabilityDateOptions;

  experienceLevelControl = new FormControl([ExperienceLevelOption.DISABLE]);

  constructor(
    breakpointObserver: BreakpointObserver,
    private readonly therapistsDataService: TherapistsDataService
  ) {
    breakpointObserver.observe(['(min-width: 992px)']).subscribe(result => {
      if (result.matches) {
        this.filterPanelMode = 'side';
      } else {
        this.filterPanelMode = 'over';
      }
    });

    this.therapistSummaries$ = this.therapistsDataService.therapistSummaries;
    this.therapistsLoadingState$ = this.therapistsDataService.loadingState;
    this.therapistsDataService.issueTags.subscribe(data => (this.allIssueTags = data));
  }

  search() {
    let minYear: number | null = null;
    let maxYear: number | null = null;

    if (this.isFilterEnabled) {
      switch (this.experienceLevelControl.value![0]) {
        case ExperienceLevelOption.ZERO_TO_TWO_YEARS:
          minYear = 0;
          maxYear = 2;
          break;

        case ExperienceLevelOption.TWO_TO_FIVE_YEARS:
          minYear = 2;
          maxYear = 5;
          break;

        case ExperienceLevelOption.FIVE_TO_TEN_YEARS:
          minYear = 5;
          maxYear = 10;
          break;

        case ExperienceLevelOption.TEN_PLUS_YEARS:
          minYear = 10;
          maxYear = null;
          break;

        default:
          minYear = null;
          maxYear = null;
          break;
      }
    }

    const request: TherapistSummariesRequest = {
      searchText: this.searchInput.nativeElement.value,
      issueTagIds: this.isFilterEnabled ? this.issueTags().map(tag => tag.id) : [],
      startRating: this.isFilterEnabled ? this.minRating : null,
      endRating: this.isFilterEnabled ? this.endRating : null,
      genders: this.isFilterEnabled
        ? this.genderSelect.selectedOptions.selected.map(e => e.value)
        : [],
      minExperienceYear: minYear,
      maxExperienceYear: maxYear,
      dateOfWeekOptions: this.isFilterEnabled
        ? this.dateSelect.selectedOptions.selected.map(e => e.value)
        : [],
    };
    this.therapistsDataService.search(request);
  }

  toggleFilterPanel(): void {
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
  }
}
