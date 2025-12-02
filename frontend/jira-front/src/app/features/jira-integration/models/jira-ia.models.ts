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

export type AppState = 'upload' | 'processing' | 'review' | 'success';  