import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {
  PrivateSessionScheduleResponse
} from '../../../../core/models/modules/manage-schedules/therapist-schedule-response.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-private-session-schedule-view-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule, DatePipe],
  templateUrl: './private-session-schedule-view-dialog.component.html',
  styleUrl: './private-session-schedule-view-dialog.component.scss',
})
export class PrivateSessionScheduleViewDialogComponent {
  data: PrivateSessionScheduleResponse = inject(MAT_DIALOG_DATA);
}
