import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Rotas Públicas (Auth)
  {
    path: 'auth',
    children: [
      { 
        path: 'login', 
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
      },
      { 
        path: 'register', 
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) 
      }
    ]
  },
  
  // Rotas Privadas (Protegidas pelo Guard)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard], // <--- A PROTEÇÃO
    children: [
      {
        path: 'jira',
        loadChildren: () => import('./features/jira-integration/jira.routes').then(m => m.JIRA_ROUTES)
      },
      { path: '', redirectTo: 'jira', pathMatch: 'full' }
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'auth/login' }
];