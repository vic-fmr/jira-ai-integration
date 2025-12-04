import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Epic, ProcessedDocument, JiraProject, UserStory, Task } from '../models/jira-ia.models';

const API_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class JiraApiService {
  private http = inject(HttpClient);

  analyzeDocument(file: File, projectKey: string): Observable<Epic> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectKey', projectKey);

    // O backend agora retorna PlanningAnalysisDTO
    return this.http.post<any>(`${API_URL}/documents/upload`, formData).pipe(
      map(response => this.convertToEpic(response))
    );
  }

  syncWithJira(epic: Epic, projectKey: string): Observable<any> {
    // Reconverte o Epic do frontend para o PlanningAnalysisDTO do backend
    const payload = {
      projectKey: projectKey, // Usado pelo JiraController
      documentSummary: epic.title,
      stories: epic.stories.map(story => ({
        title: story.title,
        userStoryFormat: story.userStoryFormat,
        priority: story.priority,
        complexity: story.complexity,
        acceptanceCriteria: story.acceptanceCriteria,
        // O backend espera List<String> para subtasks
        subtasks: story.tasks.map(task => task.title),
        dependencies: story.dependencies
      }))
    };

    // Endpoint plural ajustado conforme sua mudança anterior no Controller
    return this.http.post(`${API_URL}/jira/issues`, payload);
  }

  getProjects(): Observable<JiraProject[]> {
    return this.http.get<any[]>(`${API_URL}/jira/projects`).pipe(
      map(projects => projects.map(p => ({
        id: p.id,
        key: p.key,
        name: p.name,
        avatarUrl: p.avatarUrls?.['48x48']
      })))
    );
  }

  getHistory(): Observable<ProcessedDocument[]> {
    return this.http.get<ProcessedDocument[]>(`${API_URL}/documents`);
  }

  private convertToEpic(response: any): Epic {
    // response é o PlanningAnalysisDTO do Java
    return {
      id: 'doc-' + Date.now(),
      title: response.documentSummary || 'Análise de Requisitos',
      stories: (response.stories || []).map((s: any, index: number) => ({
        id: `story-${index}-${Date.now()}`,
        title: s.title,
        userStoryFormat: s.userStoryFormat,
        priority: s.priority,
        complexity: s.complexity,
        acceptanceCriteria: s.acceptanceCriteria || [],
        dependencies: s.dependencies || [],
        // Converte lista de strings do backend para objetos Task do frontend
        tasks: (s.subtasks || []).map((t: string, tIndex: number) => ({
          id: `task-${index}-${tIndex}`,
          title: t
        }))
      }))
    };
  }
}
