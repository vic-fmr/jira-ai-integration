import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DocumentUploadComponent } from './components/document-upload/document-upload';
import {Sidebar} from './components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  styleUrls:['./app.css'],
  templateUrl: './app.html'
})
export class App {
}
