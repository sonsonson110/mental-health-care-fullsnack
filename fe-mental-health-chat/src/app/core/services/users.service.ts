import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/dev.environment';
import { CreateUserRequest } from '../models/modules/register/create-user-request.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly baseEndpoint = environment.apiBaseUrl + '/users';

  constructor(private http: HttpClient) { }

  register(body: CreateUserRequest) {
    return this.http.post(this.baseEndpoint + '/register', body);
  }
}
