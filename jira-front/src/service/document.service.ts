import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http'; // Importar HttpResponse
import { Observable } from 'rxjs';
import { UploadResponse } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private apiUrl = 'http://localhost:8080/api/documents';

  constructor(private http: HttpClient) { }

  uploadDocument(file: File): Observable<HttpResponse<UploadResponse>> { // 💡 Mudar o tipo de retorno para HttpResponse

    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<UploadResponse>(`${this.apiUrl}/upload`, formData, {
      // 💡 O AJUSTE CRÍTICO: Dizer ao Angular para observar a resposta completa
      observe: 'response'
    });
  }
}
