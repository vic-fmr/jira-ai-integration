import { Component } from '@angular/core';
import {WelcomeBanner} from '../../components/welcome-banner/welcome-banner';
import {DocumentUploadComponent} from '../../components/document-upload/document-upload';
import {DocumentHistory} from '../../components/document-history/document-history';

@Component({
  selector: 'app-home',
  imports: [
    WelcomeBanner,
    DocumentUploadComponent,
    DocumentHistory
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
