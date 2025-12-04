import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
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
