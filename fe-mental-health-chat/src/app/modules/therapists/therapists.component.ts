import {
  Component,
  ElementRef,
  model,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
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
    IssueTagInputComponent
  ],
  providers: [FilterFormService],
  templateUrl: './therapists.component.html',
  styleUrl: './therapists.component.scss',
})
export class TherapistsComponent implements OnInit {
  @ViewChild('chipInput') chipInput!: ElementRef<HTMLInputElement>;
  @ViewChild('genderSelect') genderSelect!: MatSelectionList;

  readonly therapistSummaryData = therapistSummaryData;
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
    private readonly tagsService: TagsService
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
  }

  toggleFilterPanel(): void {
    this.isFilterPanelOpen = !this.isFilterPanelOpen;

    console.log(this.genderSelect.selectedOptions.selected.map(e => e.value));
  }
}

interface TherapistSummaryResponse {
  id: string;
  fullName: string;
  gender: Gender;
  avatarUrl: string | null;
  bio: string | null;
  issueTags: string[];
  lastExperience: string;
  experienceCount: number;
  lastEducation: string;
  educationCount: number;
  certificationCount: number;
  rating: number;
  clientCount: number;
}

const therapistSummaryData: TherapistSummaryResponse[] = [
  {
    id: 't001',
    fullName: 'Dr. Emily Johnson',
    gender: Gender.FEMALE,
    avatarUrl:
      'http://localhost:5285/images/avatar/45ee8355-6c0b-4def-920c-36cf977be134.png',
    bio: null,
    issueTags: ['Anxiety', 'Depression', 'Stress Management'],
    lastExperience: 'Senior Therapist at Mindful Wellness Center',
    experienceCount: 3,
    lastEducation: 'Ph.D. in Clinical Psychology, Stanford University',
    educationCount: 2,
    certificationCount: 4,
    rating: 4.8,
    clientCount: 127,
  },
  {
    id: 't002',
    fullName: 'Mark Rodriguez',
    gender: Gender.FEMALE,
    avatarUrl: null,
    bio: 'I am a licensed therapist with over 10 years of experience working with individuals, couples, and families. I have worked with clients with a wide range of concerns including depression, anxiety, relationship issues, parenting problems, career challenges, OCD, and ADHD. I also helped many people who have experienced physical trauma or emotional abuse.',
    issueTags: ['Relationship Issues', 'Family Therapy', 'LGBTQ+ Support'],
    lastExperience: 'Private Practice Therapist',
    experienceCount: 2,
    lastEducation: 'M.A. in Counseling Psychology, Columbia University',
    educationCount: 1,
    certificationCount: 0,
    rating: 4.6,
    clientCount: 85,
  },
  {
    id: 't003',
    fullName: 'Dr. Sarah Kim',
    gender: Gender.OTHER,
    avatarUrl: null,
    bio: 'I am a licensed clinical psychologist with over 10 years of experience working with adults, adolescents, and children. I have worked with clients with a wide range of concerns including depression, anxiety, relationship issues, parenting problems, career challenges, OCD, and ADHD. I also helped many people who have experienced physical trauma or emotional abuse.',
    issueTags: ['Trauma', 'PTSD', 'Grief Counseling'],
    lastExperience: 'Clinical Psychologist at Veterans Affairs Hospital',
    experienceCount: 4,
    lastEducation: 'Psy.D. in Clinical Psychology, Yale University',
    educationCount: 3,
    certificationCount: 5,
    rating: 4.9,
    clientCount: 203,
  },
  {
    id: 't004',
    fullName: 'James Thompson',
    gender: Gender.FEMALE,
    avatarUrl:
      'http://localhost:5285/images/avatar/45ee8355-6c0b-4def-920c-36cf977be134.png',
    bio: 'I am a licensed therapist with over 10 years of experience working with individuals, couples, and families. I have worked with clients with a wide range of concerns including depression, anxiety, relationship issues, parenting problems, career challenges, OCD, and ADHD. I also helped many people who have experienced physical trauma or emotional abuse.',
    issueTags: ['Addiction', 'Substance Abuse', 'Behavioral Therapy'],
    lastExperience: 'Addiction Counselor at Harmony Recovery Center',
    experienceCount: 2,
    lastEducation: 'M.S. in Addiction Studies, University of California, Los Angeles',
    educationCount: 2,
    certificationCount: 3,
    rating: 4.7,
    clientCount: 96,
  },
  {
    id: 't005',
    fullName: 'James Thompson',
    gender: Gender.FEMALE,
    avatarUrl:
      'http://localhost:5285/images/avatar/45ee8355-6c0b-4def-920c-36cf977be134.png',
    bio: 'I am a licensed therapist with over 10 years of experience working with individuals, couples, and families. I have worked with clients with a wide range of concerns including depression, anxiety, relationship issues, parenting problems, career challenges, OCD, and ADHD. I also helped many people who have experienced physical trauma or emotional abuse.',
    issueTags: ['Addiction', 'Substance Abuse', 'Behavioral Therapy'],
    lastExperience: 'Addiction Counselor at Harmony Recovery Center',
    experienceCount: 2,
    lastEducation: 'M.S. in Addiction Studies, University of California, Los Angeles',
    educationCount: 2,
    certificationCount: 3,
    rating: 4.7,
    clientCount: 96,
  },
];
