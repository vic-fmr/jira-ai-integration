export interface Task {
  id: string;
  title: string;
}

export interface UserStory {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Epic {
  id: string;
  title: string;
  stories: UserStory[];
}

export interface ProcessedDocument {
  id: string;
  fileName: string;
  uploadedAt: Date;
  epic: Epic;
}

export interface JiraProject {
  id: string;
  key: string;  // Ex: "PROJ", "DEV"
  name: string; // Ex: "Desenvolvimento Web", "Marketing"
  avatarUrl?: string; // Opcional
}

export interface UploadEvent {
  file: File;
  projectId: string;
}

export type AppState = 'upload' | 'processing' | 'review' | 'success';  