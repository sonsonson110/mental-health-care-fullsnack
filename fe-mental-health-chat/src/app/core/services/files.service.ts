import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/dev.environment';
import { UploadAvatarResponse } from '../models/modules/register/upload-avatar-response.model';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private readonly baseUrl = environment.apiBaseUrl + '/files';
  constructor(private http: HttpClient) {}

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadAvatarResponse>(`${this.baseUrl}/avatar`, formData);
  }
}
