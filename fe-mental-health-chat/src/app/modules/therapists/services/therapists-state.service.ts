import { Injectable } from '@angular/core';
import { TherapistSummaryResponse } from '../../../core/models/modules/therapists/therapist-summary-response.model';
import { BehaviorSubject, finalize, forkJoin } from 'rxjs';
import { TherapistsApiService } from '../../../core/api-services/therapists-api.service';
import { IssueTag } from '../../../core/models/common/issue-tag.model';
import { TagsApiService } from '../../../core/api-services/tags-api.service';
import { ExperienceLevelOption } from '../../../core/models/enums/filters/experience-level-option.enum';
import { Gender } from '../../../core/models/enums/gender.enum';
import { DateOfWeek } from '../../../core/models/enums/date-of-week.enum';

@Injectable()
export class TherapistsStateService {
  //region therapists properties
  private therapistSummariesSubject = new BehaviorSubject<TherapistSummaryResponse[]>([]);
  readonly therapistSummaries$ = this.therapistSummariesSubject.asObservable();

  private issueTagsSubject = new BehaviorSubject<IssueTag[]>([]);
  readonly issueTags$ = this.issueTagsSubject.asObservable();

  private therapistsLoadingStateSubject = new BehaviorSubject<boolean>(false);
  readonly therapistLoadingState$ = this.therapistsLoadingStateSubject.asObservable();

  // filter properties
  private filterPanelOpenSubject = new BehaviorSubject<boolean>(false);
  readonly filterPanelOpen$ = this.filterPanelOpenSubject.asObservable();

  private readonly defaultFilterState: TherapistFilterState = {
    isFilterEnabled: false,
    issueTags: [],
    minRating: 0,
    endRating: 5,
    experienceLevel: ExperienceLevelOption.DISABLED,
    searchText: '',
    selectedGenders: [],
    selectedDates: [],
  };
  private filterStateSubject = new BehaviorSubject<TherapistFilterState>(
    this.defaultFilterState
  );
  readonly filterState$ = this.filterStateSubject.asObservable();

  //endregion

  constructor(
    private therapistsService: TherapistsApiService,
    private tagsService: TagsApiService
  ) {}

  toggleFilterPanel() {
    this.filterPanelOpenSubject.next(!this.filterPanelOpenSubject.value);
  }

  //region therapists methods
  updateFilterState(filterState: Partial<TherapistFilterState>) {
    this.filterStateSubject.next({
      ...this.filterStateSubject.value,
      ...filterState,
    });
  }

  resetFilterState() {
    this.filterStateSubject.next(this.defaultFilterState);
  }

  search() {
    this.therapistsLoadingStateSubject.next(true);

    let minYear: number | null = null;
    let maxYear: number | null = null;

    if (this.filterStateSubject.value.isFilterEnabled) {
      switch (this.filterStateSubject.value.experienceLevel) {
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

    this.therapistsService
      .getTherapistSummaries({
        searchText: this.filterStateSubject.value.searchText,
        issueTagIds: this.filterStateSubject.value.isFilterEnabled
          ? this.filterStateSubject.value.issueTags.map(t => t.id)
          : [],
        startRating: this.filterStateSubject.value.isFilterEnabled
          ? this.filterStateSubject.value.minRating
          : null,
        endRating: this.filterStateSubject.value.isFilterEnabled
          ? this.filterStateSubject.value.endRating
          : null,
        genders: this.filterStateSubject.value.isFilterEnabled
          ? this.filterStateSubject.value.selectedGenders
          : [],
        minExperienceYear: minYear,
        maxExperienceYear: maxYear,
        dateOfWeekOptions: this.filterStateSubject.value.isFilterEnabled
          ? this.filterStateSubject.value.selectedDates
          : [],
      })
      .pipe(finalize(() => this.therapistsLoadingStateSubject.next(false)))
      .subscribe(therapistSummaries =>
        this.therapistSummariesSubject.next(therapistSummaries)
      );
  }

  loadTagsAndTherapists() {
    this.therapistsLoadingStateSubject.next(true);

    forkJoin({
      therapistSummaries: this.therapistsService.getTherapistSummaries(),
      issueTags: this.tagsService.getAll(),
    })
      .pipe(finalize(() => this.therapistsLoadingStateSubject.next(false)))
      .subscribe(({ therapistSummaries, issueTags }) => {
        this.therapistSummariesSubject.next(therapistSummaries);
        this.issueTagsSubject.next(issueTags);
      });
  }
  //endregion
}

interface TherapistFilterState {
  isFilterEnabled: boolean;
  issueTags: IssueTag[];
  minRating: number | null;
  endRating: number | null;
  experienceLevel: ExperienceLevelOption;
  searchText: string | null;
  selectedGenders: Gender[];
  selectedDates: DateOfWeek[];
}
