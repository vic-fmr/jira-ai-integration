import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
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
