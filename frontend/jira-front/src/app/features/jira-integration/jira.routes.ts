import { Routes } from '@angular/router';
import { JiraGeneratorComponent } from './pages/jira-generator/jira-generator.component';

export const JIRA_ROUTES: Routes = [
  {
    path: '', // Rota padrão ao entrar em /jira
    component: JiraGeneratorComponent
  }
];