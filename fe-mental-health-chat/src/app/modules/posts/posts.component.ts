import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { PostComponent } from './components/post/post.component';
import { PostsStateService, PostType } from './services/posts-state.service';
import { Observable } from 'rxjs';
import { PostResponse } from '../../core/models/modules/posts/post-response.model';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { CreateUpdatePostDialogComponent } from './components/create-update-post-dialog/create-update-post-dialog.component';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    PostComponent,
    CommonModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  providers: [PostsStateService],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent implements OnInit {
  loading$: Observable<boolean>;
  posts$: Observable<PostResponse[]>;
  type: PostType = { type: 'public', subType: 'public' };

  constructor(
    private stateService: PostsStateService,
    private dialog: MatDialog,
    private viewContainerRef: ViewContainerRef
  ) {
    this.loading$ = stateService.loading$;
    this.posts$ = stateService.posts$;
    this.stateService.type$.subscribe(type => {
      this.type = type;
    });
  }

  ngOnInit(): void {
    this.stateService.loadPosts();
  }

  onTypeChange(type: 'public' | 'personal'): void {
    this.stateService.setCurrentType({ type });
  }

  onSubTypeChange(subType: 'public' | 'private'): void {
    this.stateService.setCurrentType({ subType });
  }

  onLikeClick(postId: string) {
    this.stateService.likePost(postId);
  }

  openEditPostDialog(post?: PostResponse): void {
    const ref = this.dialog.open(CreateUpdatePostDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      minWidth: '490px',
      maxWidth: '992px',
      data: post,
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.stateService.loadPosts();
      }
    });
  }
}
