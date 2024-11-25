import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PostResponse } from '../models/modules/posts/post-response.model';
import { CreateUpdatePostRequest } from '../models/modules/posts/create-update-post-request.model';
import { PersonalPostsRequest } from '../models/modules/posts/personal-posts-request.model';

@Injectable({
  providedIn: 'root',
})
export class PostsApiService {
  private readonly baseUrl = environment.apiBaseUrl + '/posts';

  constructor(private http: HttpClient) {}

  getPublicPosts() {
    return this.http.get<PostResponse[]>(this.baseUrl);
  }

  getPersonalPosts(request?: PersonalPostsRequest) {
    let params = new HttpParams();
    if (request !== undefined && request.isPrivate !== undefined)
      params = params.set('isPrivate', request.isPrivate);
    return this.http.get<PostResponse[]>(`${this.baseUrl}/personal`, { params });
  }

  createPost(post: CreateUpdatePostRequest) {
    return this.http.post(this.baseUrl, post);
  }

  updatePost(post: CreateUpdatePostRequest) {
    return this.http.put(this.baseUrl, post);
  }

  deletePost(postId: string) {
    return this.http.delete(`${this.baseUrl}/${postId}`);
  }

  likePost(postId: string) {
    return this.http.post(`${this.baseUrl}/${postId}/like`, {});
  }
}
