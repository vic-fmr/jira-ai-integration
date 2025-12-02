import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'jira',
        loadChildren: () => import('./features/jira-integration/jira.routes').then(m => m.JIRA_ROUTES)
      },
      // Outras rotas (dashboard, etc)
      { path: '', redirectTo: 'jira', pathMatch: 'full' }
    ]
  }
];