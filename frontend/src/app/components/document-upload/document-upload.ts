import { Component, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../../service/document.service';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-upload.html',
  styleUrls: ['./document-upload.css']
})
export class DocumentUpload {

  selectedFile: File | null = null;
  uploadStatus: 'pending' | 'uploading' | 'success' | 'error' = 'pending';
  message: string = '';

  ALLOWED_TYPES = ['.pdf', '.docx', '.txt'];

  constructor(private documentService: DocumentService, private cdr: ChangeDetectorRef) { }

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

  onUpload() {
    if (!this.selectedFile) {
      this.message = 'Selecione um arquivo primeiro.';
      return;
    }

    this.uploadStatus = 'uploading';
    this.message = 'Enviando documento...';

    this.documentService.uploadDocument(this.selectedFile).subscribe({
      next: (response) => {
        const responseBody = response.body;

        if (responseBody) {
          this.uploadStatus = 'success';

          this.message = `Sucesso! ID: ${responseBody.documentId}. Mensagem: ${responseBody.message}`;
          this.selectedFile = null;

          this.cdr.detectChanges();
        } else {
          this.uploadStatus = 'error';
          this.message = 'Sucesso, mas resposta do servidor vazia.';

          this.cdr.detectChanges();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.uploadStatus = 'error';
        const errorMessage = error.error?.message || 'Erro de comunicação com o Backend.';
        this.message = `Erro ao conectar com o Backend: ${errorMessage}`;
        this.cdr.detectChanges();
        console.error('Erro no upload:', error);
      },
      complete: () => {
        if (this.uploadStatus === 'uploading') {
          this.uploadStatus = 'error';
          this.message = 'Erro desconhecido. Requisição completada, mas status não atualizado.';
        }
      }
    });
  }
}
