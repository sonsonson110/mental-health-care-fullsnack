import { Component, ElementRef, model, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Gender } from '../../core/models/enums/gender.enum';
import { MatCardModule } from '@angular/material/card';
import { ParseAvatarUrlPipe } from '../../shared/pipes/parse-avatar-url.pipe';
import { GenderPipe } from '../../shared/pipes/gender.pipe';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterFormService } from './services/filter-form.service';
import { MatSliderModule } from '@angular/material/slider';
import { IssueTag } from '../../core/models/common/issue-tag.model';
import { TagsService } from '../../core/services/tags.service';
import { genders } from '../../core/constants/gender.constant';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { experienceLevelFilterOptions } from './constants/experience-level-filter-option.constant';
import { availabilityFilterOptions } from './constants/availability-filter-option.constant';
import { IssueTagInputComponent } from '../../shared/components/issue-tag-input/issue-tag-input.component';
import { TherapistsService } from '../../core/services/therapists.service';
import { TherapistSummaryResponse } from '../../core/models/modules/therapists/therapist-summary-response.model';

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
  ],
  providers: [FilterFormService],
  templateUrl: './therapists.component.html',
  styleUrl: './therapists.component.scss',
})
export class TherapistsComponent implements OnInit {
  @ViewChild('chipInput') chipInput!: ElementRef<HTMLInputElement>;
  @ViewChild('genderSelect') genderSelect!: MatSelectionList;

  therapistSummaryResponses: TherapistSummaryResponse[] = [];
  isFilterPanelOpen = false;
  filterPanelMode: 'side' | 'over' = 'over';
  isFilterEnabled = false;

  // region tags properties
  readonly currentIssueTag = model('');
  readonly issueTags = signal<IssueTag[]>([]);
  allIssueTags: IssueTag[] = [];

  // region slider properties
  minRating = 0;
  maxRating = 5;

  readonly genders = genders;
  readonly experienceLevelFilterOptions = experienceLevelFilterOptions;
  readonly availabilityFilterOptions = availabilityFilterOptions;

  experienceLevelControl = new FormControl([0]);

  constructor(
    breakpointObserver: BreakpointObserver,
    private readonly tagsService: TagsService,
    private readonly therapistsService: TherapistsService
  ) {
    breakpointObserver.observe(['(min-width: 992px)']).subscribe(result => {
      if (result.matches) {
        this.filterPanelMode = 'side';
      }
    });
  }

  ngOnInit(): void {
    this.tagsService.getAll().subscribe(tags => {
      this.allIssueTags = tags;
    });

    this.therapistsService
      .getTherapistSummaries()
      .subscribe(therapistSummaryResponses => {
        this.therapistSummaryResponses = therapistSummaryResponses;
      });
  }

  toggleFilterPanel(): void {
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
    console.log(this.genderSelect.selectedOptions.selected.map(e => e.value));
  }
}
