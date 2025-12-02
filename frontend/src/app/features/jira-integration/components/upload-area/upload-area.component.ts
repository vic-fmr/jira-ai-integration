import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadEvent } from '../../models/jira-ia.models';

@Component({
  selector: 'app-upload-area',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center justify-center min-h-[600px] p-8">
      <div class="w-full max-w-3xl">

        <div class="text-center mb-8">
          <h1 class="text-slate-900 mb-3 text-2xl font-bold">Jira IA Generator</h1>
          <p class="text-slate-600">Transforme requisitos em tarefas do Jira automaticamente</p>
        </div>

        <div class="mb-8 max-w-md mx-auto">
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Chave do Projeto Jira <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              type="text"
              [(ngModel)]="projectKey"
              placeholder="Ex: PROJ, WEB, DS"
              class="block w-full rounded-lg border-slate-300 bg-white py-3 px-4 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border uppercase placeholder:normal-case"
              [class.border-red-300]="showError()"
              (input)="showError.set(false)"
            />

            <p class="mt-2 text-xs text-slate-500">
              Digite a chave do projeto onde as tarefas serão criadas.
            </p>
          </div>

          @if (showError()) {
            <p class="mt-1 text-sm text-red-500 font-medium">
              A chave do projeto é obrigatória.
            </p>
          }
        </div>

        <div
          (dragover)="handleDragOver($event)"
          (dragleave)="handleDragLeave()"
          (drop)="handleDrop($event)"
          [class]="getUploadAreaClasses()"
        >
          <input #fileInput type="file" class="hidden" accept=".pdf,.docx,.doc,.txt" (change)="handleFileSelect($event)" />

          <label class="flex flex-col items-center justify-center cursor-pointer w-full" (click)="fileInput.click()">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </div>
            <h2 class="text-slate-900 mb-2 font-semibold">Arraste e solte seu documento</h2>
            <p class="text-slate-500 mb-6">ou clique para selecionar</p>

            <div class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              Selecionar Arquivo
            </div>
          </label>
        </div>

        <div class="mt-8 flex items-center justify-center gap-6 text-slate-500 text-sm">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
              <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
              <path d="M10 9H8"/>
              <path d="M16 13H8"/>
              <path d="M16 17H8"/>
            </svg>
            <span>PDF</span>
          </div>
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
              <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
              <path d="M10 9H8"/>
              <path d="M16 13H8"/>
              <path d="M16 17H8"/>
            </svg>
            <span>DOCX</span>
          </div>
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
              <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
              <path d="M10 9H8"/>
              <path d="M16 13H8"/>
              <path d="M16 17H8"/>
            </svg>
            <span>TXT</span>
          </div>
        </div>

      </div>
    </div>
  `
})
export class UploadAreaComponent {
  @Output() fileUpload = new EventEmitter<UploadEvent>();

  // Agora é apenas uma string simples
  projectKey = signal<string>('');

  isDragging = signal(false);
  showError = signal(false);

  handleDragOver(event: DragEvent): void { event.preventDefault(); this.isDragging.set(true); }
  handleDragLeave(): void { this.isDragging.set(false); }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    this.processFile(file);
  }

  handleFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.processFile(file);
  }

  processFile(file: File | undefined): void {
    if (!file || !this.isValidFile(file)) return;

    // Validação: Campo de texto não pode estar vazio
    if (!this.projectKey() || this.projectKey().trim() === '') {
      this.showError.set(true);
      return;
    }

    /* FUTURO: AQUI ENTRARÁ A VALIDAÇÃO COM O BACKEND
       Exemplo:
       this.jiraService.validateProject(this.projectKey()).subscribe(exists => {
          if (exists) {
             this.fileUpload.emit(file);
          } else {
             this.errorMsg.set('Projeto não encontrado no Jira');
          }
       })
    */

    this.showError.set(false);

    // Convertendo para uppercase para padronizar antes de enviar
    const formattedKey = this.projectKey().toUpperCase();
    console.log('Arquivo:', file.name, '| Projeto:', formattedKey);

    // Emitir evento com arquivo e projectKey
    this.fileUpload.emit({
      file: file,
      projectId: formattedKey
    });
  }

  isValidFile(file: File): boolean {
    return ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type);
  }

  getUploadAreaClasses(): string {
    const base = 'relative border-2 border-dashed rounded-2xl p-16 transition-all duration-200 flex flex-col items-center bg-white';

    if (this.showError()) return `${base} border-red-300 bg-red-50`;

    return this.isDragging() ? `${base} border-blue-500 bg-blue-50` : `${base} border-slate-300 hover:border-slate-400 hover:bg-slate-50`;
  }
}
