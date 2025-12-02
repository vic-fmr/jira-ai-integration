
export interface UploadEvent {
  file: File;
  projectId: string;
}

export type AppState = 'upload' | 'processing' | 'review' | 'success';

export interface Task {
  id: string;
  title: string;
}

export interface UserStory {
  id: string;
  title: string; // Título resumido para o Jira
  userStoryFormat: string; // "Como um X, quero Y..."
  priority: 'High' | 'Medium' | 'Low';
  complexity: string; // "Low", "Medium", "High", "5 points", etc.
  acceptanceCriteria: string[];
  tasks: Task[]; // No backend é 'subtasks' (List<String>), aqui convertemos para objetos para a UI
  dependencies: string[];
}

export interface Epic {
  id: string;
  title: string; // Resumo do documento
  stories: UserStory[];
}

export interface ProcessedDocument {
  id: number;
  filename: string;
  createdAt: string;
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  avatarUrl?: string;
}
