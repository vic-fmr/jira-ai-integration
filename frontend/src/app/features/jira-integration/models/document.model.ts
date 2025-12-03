export interface UploadResponse {
  message: string;
  documentId: string | null;
  filename: string | null;
  jiraIssueKey: string | null;
}
