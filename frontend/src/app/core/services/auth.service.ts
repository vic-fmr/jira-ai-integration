import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

// DTOs alinhados com o backend
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private API_URL = 'http://localhost:8080/api/auth';
  private TOKEN_KEY = 'jira_ia_token';

  // Armazena apenas o username, pois o backend não retorna dados do usuário
  currentUser = signal<string | null>(null);

  constructor() {
    this.checkToken();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(tap(response => this.handleSuccess(response, credentials.username)));
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data)
      .pipe(tap(response => this.handleSuccess(response, data.username)));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('username');
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private handleSuccess(response: AuthResponse, username: string): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem('username', username);
    this.currentUser.set(username);
    this.router.navigate(['/jira']);
  }

  private checkToken(): void {
    const token = this.getToken();
    const username = localStorage.getItem('username');

    if (token && username) {
      this.currentUser.set(username);
    }
  }
}
