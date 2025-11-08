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
export class DocumentUploadComponent {

  // Estado para a UI
  selectedFile: File | null = null;
  uploadStatus: 'pending' | 'uploading' | 'success' | 'error' = 'pending';
  message: string = '';

  // O componente de upload de arquivos (RF-S01)
  ALLOWED_TYPES = ['.pdf', '.docx', '.txt'];

  constructor(private documentService: DocumentService, private cdr: ChangeDetectorRef) { }

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
        // 💡 Acessar o corpo (body) da resposta HTTP
        const responseBody = response.body;

        if (responseBody) {
          this.uploadStatus = 'success';
          // 💡 Usar responseBody (o DTO)
          this.message = `Sucesso! ID: ${responseBody.documentId}. Mensagem: ${responseBody.message}`;
          this.selectedFile = null;

          this.cdr.detectChanges(); // Forçar a detecção de mudanças
        } else {
          // Caso receba 200 OK, mas o corpo esteja vazio
          this.uploadStatus = 'error';
          this.message = 'Sucesso, mas resposta do servidor vazia.';

          this.cdr.detectChanges();
        }
      },
      error: (error: HttpErrorResponse) => {
        // Sua lógica de erro pode permanecer a mesma
        this.uploadStatus = 'error';
        const errorMessage = error.error?.message || 'Erro de comunicação com o Backend.';
        this.message = `Erro ao conectar com o Backend: ${errorMessage}`;
        this.cdr.detectChanges();
        console.error('Erro no upload:', error);
      },
      complete: () => {
        if (this.uploadStatus === 'uploading') {
          // Se ainda estiver em 'uploading', algo falhou. Isso é um fallback.
          this.uploadStatus = 'error';
          this.message = 'Erro desconhecido. Requisição completada, mas status não atualizado.';
        }
      }
    });
  }
}
