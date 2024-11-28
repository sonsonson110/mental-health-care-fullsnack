import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PublicSessionsApiService } from '../../../core/api-services/public-sessions-api.service';
import { PublicSessionFollowerResponse } from '../../../core/models/common/public-session-follower-response.model';
import { finalize } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ParseAvatarUrlPipe } from '../../pipes/parse-avatar-url.pipe';
import { PublicSessionFollowTypePipe } from '../../pipes/public-session-follow-type.pipe';

@Component({
  selector: 'app-public-session-followers-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    ParseAvatarUrlPipe,
    PublicSessionFollowTypePipe,
  ],
  templateUrl: './public-session-followers-dialog.component.html',
  styleUrl: './public-session-followers-dialog.component.scss',
})
export class PublicSessionFollowersDialogComponent implements OnInit {
  isLoading = true;
  followers: PublicSessionFollowerResponse[] = [];
  readonly data: string = inject(MAT_DIALOG_DATA);

  constructor(private publicSessionsApiService: PublicSessionsApiService) {}

  ngOnInit(): void {
    this.publicSessionsApiService
      .getPublicSessionFollowers(this.data)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(followers => {
        this.followers = followers;
      });
  }
}
