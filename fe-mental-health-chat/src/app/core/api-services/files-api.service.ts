import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class FilesApiService {
  private readonly baseUrl = environment.apiBaseUrl + '/files';
  constructor(private http: HttpClient) {}

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{fileName: string}>(this.baseUrl + '/images', formData);
  }
}
