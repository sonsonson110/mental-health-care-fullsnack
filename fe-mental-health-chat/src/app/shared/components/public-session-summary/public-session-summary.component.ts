import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PublicSessionSummaryResponse } from '../../../core/models/public-session-summary-response.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ParseAvatarUrlPipe } from '../../pipes/parse-avatar-url.pipe';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { PublicSessionTypePipe } from '../../pipes/public-session-type.pipe';
import { AuthApiService } from '../../../core/api-services/auth-api.service';
import { MatMenuModule } from '@angular/material/menu';
import { ParseImageUrlPipe } from '../../pipes/parse-image-url.pipe';
import { publicSessionFollowTypes } from '../../../core/constants/public-session-follow-type.constant';
import { PublicSessionFollowType } from '../../../core/models/enums/public-session-follow-type.enum';

@Component({
  selector: 'app-public-session-summary',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule,
    ParseAvatarUrlPipe,
    NgOptimizedImage,
    MatChipsModule,
    MatIconModule,
    PublicSessionTypePipe,
    MatMenuModule,
    ParseImageUrlPipe,
    MatMenuModule,
  ],
  templateUrl: './public-session-summary.component.html',
  styleUrl: './public-session-summary.component.scss',
})
export class PublicSessionSummaryComponent {
  @Input() publicSessionSummary!: PublicSessionSummaryResponse;
  @Input() showEditOption = true;

  @Output() editClickEvent = new EventEmitter<void>();
  @Output() followersClickEvent = new EventEmitter<void>();
  @Output() followSelectEvent = new EventEmitter<PublicSessionFollowType>();

  readonly publicSessionFollowTypes = publicSessionFollowTypes;

  constructor(private authService: AuthApiService) {}

  canEditSession(): boolean {
    return this.showEditOption && this.authService.getSessionUserId() === this.publicSessionSummary.therapist.id;
  }

  canFollowSession(): boolean {
    return this.authService.getSessionUserId() !== this.publicSessionSummary.therapist.id;
  }

  canReportSession(): boolean {
    return this.authService.getSessionUserId() !== this.publicSessionSummary.therapist.id;
  }

  onEditClick(): void {
    this.editClickEvent.emit();
  }

  onFollowSelect(newType: PublicSessionFollowType): void {
    this.followSelectEvent.emit(newType);
  }

  onFollowersClick(): void {
    this.followersClickEvent.emit();
  }

  protected readonly PublicSessionFollowType = PublicSessionFollowType;
}
