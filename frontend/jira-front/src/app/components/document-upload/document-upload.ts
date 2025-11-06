import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../../service/document.service';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-upload.html'
})
export class DocumentUploadComponent {
  
  // Estado para a UI
  selectedFile: File | null = null;
  uploadStatus: 'pending' | 'uploading' | 'success' | 'error' = 'pending';
  message: string = '';
  
  // O componente de upload de arquivos (RF-S01)
  ALLOWED_TYPES = ['.pdf', '.docx', '.txt'];

  constructor(private documentService: DocumentService) { }

  // Função chamada quando o usuário seleciona um arquivo
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension && this.ALLOWED_TYPES.includes(`.${fileExtension}`)) {
        this.selectedFile = file;
        this.uploadStatus = 'pending';
        this.message = `Arquivo selecionado: ${file.name}`;
      } else {
        this.selectedFile = null;
        this.uploadStatus = 'error';
        this.message = `Formato de arquivo não suportado. Use ${this.ALLOWED_TYPES.join(', ')}.`;
      }
    }
  }

  // Função chamada ao clicar no botão de upload
  onUpload() {
    if (!this.selectedFile) {
      this.message = 'Selecione um arquivo primeiro.';
      return;
    }

    this.uploadStatus = 'uploading';
    this.message = 'Enviando documento...';

    this.documentService.uploadDocument(this.selectedFile).subscribe({
      next: (response) => {
        this.uploadStatus = 'success';
        this.message = `Sucesso! ID: ${response.documentId}. Mensagem: ${response.message}`;
        this.selectedFile = null;
      },
      error: (error: HttpErrorResponse) => {
        this.uploadStatus = 'error';
        const errorMessage = error.error?.message || 'Erro de comunicação com o Backend.';
        this.message = `Erro ao conectar com o Jira (simulado): ${errorMessage}`; 
        console.error('Erro no upload:', error);
      },
      complete: () => {}
    });
  }
}