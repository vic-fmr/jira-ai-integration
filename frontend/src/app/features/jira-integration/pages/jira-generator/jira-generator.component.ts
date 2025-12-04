// noinspection JSUnusedGlobalSymbols

import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadAreaComponent } from '../../components/upload-area/upload-area.component';
import { ProcessingStateComponent } from '../../components/processing-state/processing-state.component';
import { ReviewStageComponent } from '../../components/review-stage/review-stage.component';
import { SuccessStateComponent } from '../../components/success-state/success-state.component';

import { Epic, ProcessedDocument, AppState, UploadEvent } from '../../models/jira-ia.models';
import { JiraApiService } from '../../services/jira-api.service';

// @ts-ignore
@Component({
  selector: 'app-jira-generator',
  standalone: true,
  imports: [
    CommonModule,
    UploadAreaComponent,
    ProcessingStateComponent,
    ReviewStageComponent,
    SuccessStateComponent
  ],
  templateUrl: './jira-generator.component.html'
})
export class JiraGeneratorComponent {
  // Injeção do Serviço
  private jiraService = inject(JiraApiService);

  state = signal<AppState>('upload');
  currentFile = signal<File | null>(null);
  currentFileName = signal<string>('');
  currentProjectKey = signal<string>('');
  processedData = signal<Epic | null>(null);

  handleFileUpload(event: UploadEvent): void {
    this.currentFile.set(event.file);
    this.currentFileName.set(event.file.name);
    this.currentProjectKey.set(event.projectId);
    this.state.set('processing');

    // CONEXÃO COM BACKEND (via Service)
    this.jiraService.analyzeDocument(event.file, event.projectId).subscribe({
      next: (data) => {
        this.processedData.set(data);
        this.state.set('review');
      },
      error: (err) => {
        console.error('Erro ao processar:', err);
        this.state.set('upload'); // Volta em caso de erro
        alert('Erro ao processar documento. Verifique o console.');
      }
    });
  }

  handleSyncSuccess(): void {
    console.log('Sincronização concluída no componente filho. Mudando estado para sucesso.');
    this.state.set('success');
  }

  handleNewUpload(): void {
    this.currentFile.set(null);
    this.currentFileName.set('');
    this.currentProjectKey.set('');
    this.processedData.set(null);
    this.state.set('upload');
  }
}
