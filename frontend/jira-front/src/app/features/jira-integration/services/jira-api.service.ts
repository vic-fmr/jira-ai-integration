import { Injectable, inject } from '@angular/core'; // <--- Mudou de Component para Injectable
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Epic, ProcessedDocument } from '../models/jira-ia.models';

// URL base do Backend
const API_URL = 'http://localhost:8080/api'; 

@Injectable({
    providedIn: 'root'
})
export class JiraApiService {
  private http = inject(HttpClient); 

  analyzeDocument(file: File): Observable<Epic> {
    console.log('Simulando envio ao backend:', file.name);
    return of(MOCK_EPIC_RESPONSE).pipe(delay(3000));
  }

  syncWithJira(epic: Epic): Observable<any> {
    console.log('Enviando JSON final para o Jira:', epic);
    return of({ success: true, jiraLink: 'https://jira.com/browse/EPIC-123' }).pipe(delay(1000));
  }

  getHistory(): Observable<ProcessedDocument[]> {
    return of([]); 
  }
}

const MOCK_EPIC_RESPONSE: Epic = {
  id: `epic-${Date.now()}`,
  title: 'Sistema de Autenticação e Gerenciamento',
  stories: [
    {
      id: 'story-1', title: 'Login no sistema',
      tasks: [{ id: 't1', title: 'Endpoint JWT' }, { id: 't2', title: 'Tela Login' }]
    },
    {
      id: 'story-2', title: 'Recuperação de Senha',
      tasks: [{ id: 't3', title: 'Envio de Email' }]
    }
  ]
};