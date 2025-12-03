import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadResponse } from '../../features/jira-integration/models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private apiUrl = 'http://localhost:8080/api/documents';

  constructor(private http: HttpClient) { }

  uploadDocument(file: File): Observable<HttpResponse<UploadResponse>> {

    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('projectKey', "KAN")

    return this.http.post<UploadResponse>(`${this.apiUrl}/upload`, formData,  {
      observe: 'response'
    });
  }
}
