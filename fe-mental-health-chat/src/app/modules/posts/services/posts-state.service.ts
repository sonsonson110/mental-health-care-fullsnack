import { Injectable } from '@angular/core';
import { PostResponse } from '../../../core/models/modules/posts/post-response.model';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { PostsApiService } from '../../../core/api-services/posts-api.service';
import { CreateUpdatePostRequest } from '../../../core/models/modules/posts/create-update-post-request.model';

@Injectable()
export class PostsStateService {
  private loadingState$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingState$.asObservable();

  private postsSubject = new BehaviorSubject<PostResponse[]>([]);
  readonly posts$ = this.postsSubject.asObservable();

  private typeSubject = new BehaviorSubject<PostType>({
    type: 'public',
    subType: 'public',
  });
  readonly type$ = this.typeSubject.asObservable();

  constructor(private postsApiService: PostsApiService) {}

  setCurrentType(type: Partial<PostType>) {
    const currentType = this.typeSubject.value;
    if (
      (type.type === undefined || currentType.type === type.type) &&
      (type.subType === undefined || currentType.subType === type.subType)
    ) {
      return;
    }

    console.log(currentType, type);

    this.typeSubject.next({ ...currentType, ...type });
    this.loadPosts();
  }

  loadPosts() {
    this.loadingState$.next(true);
    const currentType = this.typeSubject.value;
    if (currentType.type === 'public') {
      this.loadPublicPosts();
    } else {
      this.loadPersonalPosts(currentType.subType === 'private');
    }
  }

  private loadPublicPosts() {
    this.loadingState$.next(true);
    this.postsApiService
      .getPublicPosts()
      .pipe(finalize(() => this.loadingState$.next(false)))
      .subscribe(posts => {
        this.postsSubject.next(posts);
      });
  }

  private loadPersonalPosts(isPrivate: boolean) {
    this.loadingState$.next(true);
    this.postsApiService
      .getPersonalPosts({ isPrivate })
      .pipe(finalize(() => this.loadingState$.next(false)))
      .subscribe(posts => {
        this.postsSubject.next(posts);
      });
  }

  createPost(request: CreateUpdatePostRequest) {
    return this.postsApiService.createPost(request);
  }

  updatePost(request: CreateUpdatePostRequest) {
    return this.postsApiService.updatePost(request);
  }

  likePost(postId: string) {
    return this.postsApiService
      .likePost(postId)
      .pipe(tap(() => this.loadPosts()))
      .subscribe();
  }
}

export interface PostType {
  type: 'public' | 'personal';
  subType: 'public' | 'private';
}
