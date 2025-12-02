import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center min-h-[600px] p-8">
      <div class="text-center max-w-md">
        <div class="mb-8 flex justify-center"><div class="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg></div></div>
        <h2 class="text-slate-900 mb-3 text-xl font-bold">Sincronização Concluída!</h2>
        <p class="text-slate-600 mb-8">Dados enviados para o Jira com sucesso.</p>
        <div class="flex flex-col gap-3">
            <button (click)="newUpload.emit()" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Processar Novo</button>
            <button (click)="openJira()" class="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">Abrir Jira</button>
        </div>
      </div>
    </div>
  `
})
export class SuccessStateComponent {
  @Output() newUpload = new EventEmitter<void>();
  openJira(): void { window.open('https://jira.atlassian.com', '_blank'); }
}