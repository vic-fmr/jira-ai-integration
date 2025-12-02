import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-center mb-6">
           <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">JI</div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900">Entre na sua conta</h2>
        <p class="mt-2 text-center text-sm text-slate-600">
          Ou <a routerLink="/auth/register" class="font-medium text-blue-600 hover:text-blue-500">crie uma nova conta</a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form class="space-y-6" (ngSubmit)="onSubmit()">

            <div>
              <label for="username" class="block text-sm font-medium text-slate-700">Nome de Usuário</label>
              <div class="mt-1">
                <input id="username" name="username" type="text" autocomplete="username" required [(ngModel)]="username"
                  class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-slate-700">Senha</label>
              <div class="mt-1">
                <input id="password" name="password" type="password" autocomplete="current-password" required [(ngModel)]="password"
                  class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
            </div>

            <div>
              <button type="submit" [disabled]="isLoading()"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                @if (isLoading()) {
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Entrando...
                } @else {
                  Entrar
                }
              </button>
            </div>

            @if (error()) {
              <div class="bg-red-50 text-red-700 p-3 rounded text-sm text-center">
                {{ error() }}
              </div>
            }
          </form>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  authService = inject(AuthService);

  username = '';
  password = '';
  isLoading = signal(false);
  error = signal('');

  onSubmit() {
    this.isLoading.set(true);
    this.error.set('');

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: () => {
          // O redirecionamento acontece no service
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('Usuário ou senha inválidos');
          this.isLoading.set(false);
        }
      });
  }
}
