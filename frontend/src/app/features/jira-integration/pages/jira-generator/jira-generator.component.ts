import { Component, signal, inject } from '@angular/core'; // Adicione inject
import { CommonModule } from '@angular/common';
import { UploadAreaComponent } from '../../components/upload-area/upload-area.component';
import { ProcessingStateComponent } from '../../components/processing-state/processing-state.component';
import { ReviewStageComponent } from '../../components/review-stage/review-stage.component';
import { SuccessStateComponent } from '../../components/success-state/success-state.component';

import { Epic, ProcessedDocument, AppState } from '../../models/jira-ia.models';
import { JiraApiService } from '../../services/jira-api.service'; // <--- IMPORTANTE

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
  template: `
    <div class="bg-slate-50 min-h-full">
      
      @if (state() === 'upload') {
        <app-upload-area (fileUpload)="handleFileUpload($event)" />
      }
      @if (state() === 'processing') {
        <app-processing-state [fileName]="currentFileName()" />
      }
      @if (state() === 'review' && processedData()) {
        <app-review-stage
          [epic]="processedData()!"
          [isReadOnly]="false"
          (approve)="handleApprove($event)"
          (cancel)="handleNewUpload()"
        />
      }
      @if (state() === 'success') {
        <app-success-state (newUpload)="handleNewUpload()" />
      }
    </div>
  `
})
export class JiraGeneratorComponent {
  // Injeção do Serviço
  private jiraService = inject(JiraApiService);

  state = signal<AppState>('upload');
  currentFile = signal<File | null>(null);
  currentFileName = signal<string>('');
  processedData = signal<Epic | null>(null);

  handleFileUpload(file: File): void {
    this.currentFile.set(file);
    this.currentFileName.set(file.name);
    this.state.set('processing');

    // CONEXÃO COM BACKEND (via Service)
    // Aqui troquei o setTimeout manual pelo Observable do serviço
    this.jiraService.analyzeDocument(file).subscribe({
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

  handleApprove(epic: Epic): void {
    // CONEXÃO COM BACKEND (via Service)
    this.jiraService.syncWithJira(epic).subscribe({
      next: (response) => {
        console.log('Sucesso:', response);
        this.state.set('success');
      },
      error: (err) => console.error('Erro ao sincronizar:', err)
    });
  }

  handleNewUpload(): void {
    this.currentFile.set(null);
    this.currentFileName.set('');
    this.processedData.set(null);
    this.state.set('upload');
  }
}