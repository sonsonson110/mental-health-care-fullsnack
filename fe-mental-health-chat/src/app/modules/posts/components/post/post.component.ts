import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { PostResponse } from '../../../../core/models/modules/posts/post-response.model';
import { ParseAvatarUrlPipe } from '../../../../shared/pipes/parse-avatar-url.pipe';
import { AuthApiService } from '../../../../core/api-services/auth-api.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatChipsModule,
    NgOptimizedImage,
    ParseAvatarUrlPipe,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  @Input() post!: PostResponse;
  @Output() editClickEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() likeClickEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(private auth: AuthApiService) {}

  canEditPost(): boolean {
    return this.auth.getSessionUserId() === this.post.user.id;
  }

  canReportPost(): boolean {
    return true;
  }

  onEditClick(): void {
    this.editClickEvent.emit();
  }

  onReportClick(): void {
    // Implement report functionality
  }

  onLikeClick(): void {
    this.likeClickEvent.emit();
  }
}
