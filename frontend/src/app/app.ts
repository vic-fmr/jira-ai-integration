import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DocumentUploadComponent } from './components/document-upload/document-upload';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DocumentUploadComponent],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('jira-front');
}
