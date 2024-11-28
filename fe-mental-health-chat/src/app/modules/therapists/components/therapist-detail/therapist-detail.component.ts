import { Component, OnInit } from '@angular/core';
import { TherapistsApiService } from '../../../../core/api-services/therapists-api.service';
import { TherapistDetailResponse } from '../../../../core/models/modules/therapists/therapist-detail-response.model';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ParseAvatarUrlPipe } from '../../../../shared/pipes/parse-avatar-url.pipe';
import { CommonModule } from '@angular/common';
import { GenderPipe } from '../../../../shared/pipes/gender.pipe';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { CalendarEvent, CalendarModule } from 'angular-calendar';
import { startOfWeek } from 'date-fns';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TherapistRegistrationDialogComponent } from '../therapist-registration-dialog/therapist-registration-dialog.component';
import { mapAvailableTemplateItemsToCalendarEvents } from '../../../../core/mappers';

@Component({
  selector: 'app-therapist-detail',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    ParseAvatarUrlPipe,
    CommonModule,
    GenderPipe,
    MatChipsModule,
    MatTooltipModule,
    MatListModule,
    CalendarModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './therapist-detail.component.html',
  styleUrl: './therapist-detail.component.scss',
})
export class TherapistDetailComponent implements OnInit {
  isLoading = false;
  therapistDetail: TherapistDetailResponse | null = null;

  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  constructor(
    private therapistsService: TherapistsApiService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const routeId = params.get('id');
      if (routeId) {
        this.loadTherapistDetail(routeId);
      }
    });
  }

  combinedEducationMajorDegree(major: string | null, degree: string | null): string {
    let result = '';
    if (major) {
      result += major;
    }
    if (degree) {
      if (result) {
        result += ', ';
      }
      result += degree;
    }
    return result;
  }

  loadTherapistDetail(id: string) {
    this.isLoading = true;

    this.therapistsService
      .getTherapistDetail(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: response => {
          this.therapistDetail = response;
          this.loadAvailabilityTemplate();
        },
        error: () => {
          this.router.navigate(['/not-found']);
        },
      });
  }

  loadAvailabilityTemplate() {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // 1 = Monday
    this.events = this.therapistDetail?.availabilityTemplates.map(template =>
      mapAvailableTemplateItemsToCalendarEvents(template, weekStart)
    ) ?? [];
  }

  openRegistrationDialog(): void {
    const dialogRef = this.dialog.open(TherapistRegistrationDialogComponent, {
      data: {
        therapistFullName: this.therapistDetail!.fullName,
        therapistId: this.therapistDetail!.id,
      },
      maxWidth: '992px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }
}
