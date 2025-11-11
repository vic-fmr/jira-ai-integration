import { Component } from '@angular/core';
import {WelcomeBanner} from '../../components/welcome-banner/welcome-banner';
import {DocumentUpload} from '../../components/document-upload/document-upload';
import {DocumentHistory} from '../../components/document-history/document-history';

@Component({
  selector: 'app-home',
  imports: [
    WelcomeBanner,
    DocumentUpload,
    DocumentHistory
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
