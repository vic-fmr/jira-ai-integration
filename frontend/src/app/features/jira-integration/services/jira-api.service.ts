import { Injectable, inject } from '@angular/core'; // <--- Mudou de Component para Injectable
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Epic, ProcessedDocument, JiraProject } from '../models/jira-ia.models';

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

  getProjects(): Observable<JiraProject[]> {
    // --- CÓDIGO FUTURO ---
    // return this.http.get<JiraProject[]>(`${API_URL}/jira/projects`);

    // --- CÓDIGO MOCK (SIMULAÇÃO) ---
    const MOCK_PROJECTS: JiraProject[] = [
      { id: '10001', key: 'DS', name: 'Design System' },
      { id: '10002', key: 'WEB', name: 'Plataforma Web 2.0' },
      { id: '10003', key: 'MOB', name: 'App Mobile iOS' },
      { id: '10004', key: 'INFRA', name: 'Infraestrutura Cloud' }
    ];
    return of(MOCK_PROJECTS).pipe(delay(500)); // Simula delay de rede
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