import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadResponse } from '../models/document.model'; // Importa o modelo criado

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  // URL base do seu Backend. Ajuste se necessário.
  private apiUrl = 'http://localhost:8080/api/documents'; 

  constructor(private http: HttpClient) { }

  uploadDocument(file: File): Observable<UploadResponse> {
  
    const formData = new FormData();
    // O nome 'file' deve coincidir com o @RequestParam("file")
    formData.append('file', file, file.name);

    return this.http.post<UploadResponse>(`${this.apiUrl}/upload`, formData);
  }
}