import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ParseAvatarUrlPipe } from '../../../../shared/pipes/parse-avatar-url.pipe';
import { GenderPipe } from '../../../../shared/pipes/gender.pipe';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import { IssueTagInputComponent } from '../../../../shared/components/issue-tag-input/issue-tag-input.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TherapistsStateService } from '../../services/therapists-state.service';
import { debounceTime, Observable, combineLatest, filter } from 'rxjs';
import { TherapistSummaryResponse } from '../../../../core/models/modules/therapists/therapist-summary-response.model';
import { IssueTag } from '../../../../core/models/common/issue-tag.model';
import { ExperienceLevelOption } from '../../../../core/models/enums/filters/experience-level-option.enum';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { genders } from '../../../../core/constants/gender.constant';
import { experienceLevelOptions } from '../../constants/experience-level-filter-option.constant';
import { datesOfWeek } from '../../../../core/constants/dates-of-week.constant';
import { Gender } from '../../../../core/models/enums/gender.enum';
import { DateOfWeek } from '../../../../core/models/enums/date-of-week.enum';

@Component({
  selector: 'app-therapist-summaries',
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
  templateUrl: './therapist-summaries.component.html',
  styleUrl: './therapist-summaries.component.scss',
})
export class TherapistSummariesComponent implements OnInit {
  therapistSummaries$: Observable<TherapistSummaryResponse[]>;
  therapistsLoadingState$: Observable<boolean>;
  allIssueTags: IssueTag[] = [];

  isFilterPanelOpen$: Observable<boolean>;
  filterPanelMode: 'side' | 'over' = 'over';

  filterForm = new FormGroup({
    isFilterEnabled: new FormControl(false),
    searchText: new FormControl(''),
    minRating: new FormControl(0),
    endRating: new FormControl(5),
    experienceLevel: new FormControl([ExperienceLevelOption.DISABLED]), // it's an ARRAY
    selectedGenders: new FormControl([] as Gender[]),
    selectedDates: new FormControl([] as DateOfWeek[]),
    issueTags: new FormControl([] as IssueTag[]),
  });

  readonly genders = genders;
  readonly experienceLevelOptions = experienceLevelOptions;
  readonly availabilityDateOptions = datesOfWeek;

  constructor(
    breakpointObserver: BreakpointObserver,
    private router: Router,
    private readonly therapistsStateService: TherapistsStateService,
    private route: ActivatedRoute
  ) {
    breakpointObserver.observe(['(min-width: 992px)']).subscribe(result => {
      if (result.matches) {
        this.filterPanelMode = 'side';
      } else {
        this.filterPanelMode = 'over';
      }
    });

    this.therapistSummaries$ = this.therapistsStateService.therapistSummaries$;
    this.therapistsLoadingState$ = this.therapistsStateService.therapistLoadingState$;
    this.therapistsStateService.issueTags$.subscribe(data => (this.allIssueTags = data));
    this.isFilterPanelOpen$ = this.therapistsStateService.filterPanelOpen$;
  }

  ngOnInit() {
    this.therapistsStateService.loadTags();

    // Sync form with service state
    this.therapistsStateService.filterState$.subscribe(filterState => {
      this.filterForm.patchValue(
        {
          isFilterEnabled: filterState.isFilterEnabled,
          searchText: filterState.searchText,
          minRating: filterState.minRating,
          endRating: filterState.endRating,
          experienceLevel: [filterState.experienceLevel],
          selectedGenders: filterState.selectedGenders,
          selectedDates: filterState.selectedDates,
          issueTags: filterState.issueTags,
        },
        { emitEvent: false }
      ); // Prevent triggering valueChanges
    });

    this.filterForm.valueChanges.pipe(debounceTime(200)).subscribe(filterState => {
      this.therapistsStateService.updateFilterState({
        isFilterEnabled: filterState.isFilterEnabled!,
        searchText: filterState.searchText,
        minRating: filterState.minRating,
        endRating: filterState.endRating,
        experienceLevel: filterState.experienceLevel![0],
        selectedGenders: filterState.selectedGenders ?? [],
        selectedDates: filterState.selectedDates ?? [],
        issueTags: filterState.issueTags ?? [],
      });
    });

    combineLatest([
      this.therapistsStateService.issueTags$.pipe(filter(tags => tags.length > 0)),
      this.route.queryParams,
    ]).subscribe(([issueTags, params]) => {
      const issueTagIds = params['issueTagIds'] ? params['issueTagIds'] : [];
      if (issueTagIds.length > 0) {
        const selectedTags = issueTags.filter(tag =>
          issueTagIds.includes(tag.id.toString())
        ); // Match available IDs
        this.therapistsStateService.updateFilterState({
          issueTags: selectedTags,
          isFilterEnabled: true,
        });
      }
      this.therapistsStateService.search();
    });
  }

  resetFilters = () => this.therapistsStateService.resetFilterState();

  search() {
    this.therapistsStateService.search();
  }

  toggleFilterPanel(): void {
    this.therapistsStateService.toggleFilterPanel();
  }

  onUserDetailsClick(therapistId: string): void {
    this.router.navigate(['/therapists', therapistId]);
  }
}
