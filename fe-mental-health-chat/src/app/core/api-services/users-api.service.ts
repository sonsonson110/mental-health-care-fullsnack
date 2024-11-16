import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/dev.environment';
import { CreateUserRequest } from '../models/modules/register/create-user-request.model';
import { UserDetailResponse } from '../models/modules/profile/user-detail-response.model';
import { UpdateUserRequest } from '../models/modules/profile/update-user-request.model';
import { ChangePasswordRequest } from '../models/modules/profile/change-password-request.model';
import { DeleteUserRequest } from '../models/modules/profile/delete-user-request.model';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {
  private readonly baseEndpoint = environment.apiBaseUrl + '/users';

  constructor(private http: HttpClient) { }

  register(body: CreateUserRequest) {
    return this.http.post(this.baseEndpoint + '/register', body);
  }

  getUserDetail() {
    return this.http.get<UserDetailResponse>(this.baseEndpoint + '/me');
  }

  updateUser(body: UpdateUserRequest) {
    return this.http.put<UserDetailResponse>(this.baseEndpoint + '/me', body);
  }

  changePassword(body: ChangePasswordRequest) {
    return this.http.put(this.baseEndpoint + '/me/change-password', body);
  }

  deleteUser(body: DeleteUserRequest) {
    return this.http.post(this.baseEndpoint + '/me/delete', body);
  }
}
