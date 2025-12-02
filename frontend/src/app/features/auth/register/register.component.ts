import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-center mb-6">
           <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">JI</div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900">Crie sua conta</h2>
        <p class="mt-2 text-center text-sm text-slate-600">
          Já tem uma conta? <a routerLink="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">Faça login</a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form class="space-y-6" (ngSubmit)="onSubmit()">

            <div>
              <label class="block text-sm font-medium text-slate-700">Nome de Usuário</label>
              <div class="mt-1">
                <input name="username" type="text" required [(ngModel)]="username"
                  class="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ex: joaosilva123">
              </div>
              <p class="mt-1 text-xs text-slate-500">Será usado para fazer login no sistema</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700">Senha</label>
              <div class="mt-1">
                <input name="password" type="password" required [(ngModel)]="password"
                  class="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700">Confirme a Senha</label>
              <div class="mt-1">
                <input name="confirmPassword" type="password" required [(ngModel)]="confirmPassword"
                  class="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  [class.border-red-300]="error() && error().includes('senhas')"
                >
              </div>
            </div>

            @if (error()) {
              <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative text-sm text-center">
                {{ error() }}
              </div>
            }

            <button type="submit" [disabled]="isLoading()"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
               @if (isLoading()) {
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Criando conta...
               } @else {
                  Cadastrar
               }
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  authService = inject(AuthService);

  username = '';
  password = '';
  confirmPassword = '';

  isLoading = signal(false);
  error = signal('');

  onSubmit() {
    this.error.set('');

    // 1. Validação de username
    if (this.username.length < 3) {
      this.error.set('O nome de usuário deve ter pelo menos 3 caracteres.');
      return;
    }

    // 2. Validação de Senhas iguais
    if (this.password !== this.confirmPassword) {
      this.error.set('As senhas não coincidem.');
      return;
    }

    // 3. Validação de tamanho de senha
    if (this.password.length < 6) {
      this.error.set('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    this.isLoading.set(true);

    this.authService.register({
      username: this.username,
      password: this.password
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 409 || err.error?.message?.includes('já existe')) {
          this.error.set('Este nome de usuário já está em uso.');
        } else {
          this.error.set('Erro ao criar conta. Tente novamente.');
        }
      }
    });
  }
}
