import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap, delay } from 'rxjs';

export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { name: string; email: string; password: string; }
export interface AuthResponse { token: string; user: { id: string; name: string; email: string; }; }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // URL do Backend
  private API_URL = 'http://localhost:8080/api/auth';
  private TOKEN_KEY = 'jira_ia_token';

  // Estado reativo do usuário (Signals)
  currentUser = signal<{name: string, email: string} | null>(null);

  constructor() {
    this.checkToken();
  }

  // --- AÇÕES ---

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // MOCK: Simulando resposta do Backend
    const mockResponse: AuthResponse = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake-token',
      user: { id: '1', name: 'Usuário Teste', email: credentials.email }
    };

    return of(mockResponse).pipe(
      delay(1000), // Simula rede
      tap(response => this.handleSuccess(response))
    );
    
    // REAL: Descomentar quando tiver back-end
    // return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
    //   .pipe(tap(response => this.handleSuccess(response)));
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    // MOCK
    const mockResponse: AuthResponse = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake-token',
      user: { id: '2', name: data.name, email: data.email }
    };
    return of(mockResponse).pipe(
      delay(1000),
      tap(response => this.handleSuccess(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  // --- GERENCIAMENTO DE TOKEN ---

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private handleSuccess(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    this.currentUser.set(response.user);
    this.router.navigate(['/jira']); // Redireciona para a home
  }

  private checkToken(): void {
    if (this.getToken()) {
      // Aqui vamos chamar um endpoint /me para pegar dados do usuário
      this.currentUser.set({ name: 'Usuário Retornado', email: 'user@test.com' });
    }
  }
}