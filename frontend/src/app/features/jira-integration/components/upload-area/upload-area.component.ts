import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadEvent } from '../../models/jira-ia.models';

@Component({
  selector: 'app-upload-area',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-area.component.html',
  styleUrl: './upload-area.component.scss'
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
