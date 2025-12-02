import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Epic, UserStory, Task } from '../../models/jira-ia.models';

@Component({
  selector: 'app-review-stage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 p-8">
      <div class="max-w-5xl mx-auto">
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-4">
            <div [class]="isReadOnly ? 'w-2 h-2 rounded-full bg-slate-400' : 'w-2 h-2 rounded-full bg-amber-500'"></div>
            <span class="text-sm text-slate-600">
              {{ isReadOnly ? 'Visualização do Histórico' : 'Revisão Necessária' }}
            </span>
          </div>
          <h1 class="text-slate-900 mb-2 font-bold text-3xl">
            {{ isReadOnly ? 'Visualização de Documento Processado' : 'Revisão e Edição' }}
          </h1>
          <p class="text-slate-600">
            {{ isReadOnly 
              ? 'Este documento já foi sincronizado com o Jira. Visualize os detalhes abaixo.'
              : 'Revise os itens gerados pela IA, edite ou exclua o que for necessário antes de sincronizar com o Jira'
            }}
          </p>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-3">
                <div class="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">
                  ÉPICO
                </div>
              </div>
              @if (editingEpic()) {
                <input
                  type="text"
                  [ngModel]="currentEpic().title"
                  (ngModelChange)="handleEpicTitleChange($event)"
                  (blur)="editingEpic.set(false)"
                  (keydown.enter)="editingEpic.set(false)"
                  class="w-full px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-xl font-semibold"
                  [autofocus]="true"
                />
              } @else {
                <h2 class="text-slate-900 text-xl font-semibold">{{ currentEpic().title }}</h2>
              }
            </div>
            @if (!isReadOnly) {
              <button
                (click)="editingEpic.set(true)"
                class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar épico"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                  <path d="m15 5 4 4"/>
                </svg>
              </button>
            }
          </div>
          <div class="text-sm text-slate-500">
            {{ currentEpic().stories.length }} {{ currentEpic().stories.length === 1 ? 'história' : 'histórias' }} de usuário
          </div>
        </div>

        <div class="space-y-4 mb-8">
          @for (story of currentEpic().stories; track story.id; let storyIndex = $index) {
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div class="p-6">
                <div class="flex items-start gap-4">
                  <button
                    (click)="toggleStoryExpanded(story.id)"
                    class="mt-1 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    @if (isStoryExpanded(story.id)) {
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    }
                  </button>

                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-3">
                      <div class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                        HISTÓRIA {{ storyIndex + 1 }}
                      </div>
                    </div>
                    @if (editingStory() === story.id) {
                      <input
                        type="text"
                        [ngModel]="story.title"
                        (ngModelChange)="handleStoryTitleChange(story.id, $event)"
                        (blur)="editingStory.set(null)"
                        (keydown.enter)="editingStory.set(null)"
                        class="w-full px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        [autofocus]="true"
                      />
                    } @else {
                      <p class="text-slate-900 font-medium">{{ story.title }}</p>
                    }
                  </div>

                  @if (!isReadOnly) {
                    <div class="flex items-center gap-2">
                      <button
                        (click)="editingStory.set(story.id)"
                        class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar história"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                          <path d="m15 5 4 4"/>
                        </svg>
                      </button>
                      <button
                        (click)="handleDeleteStory(story.id)"
                        class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir história"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  }
                </div>
              </div>

              @if (isStoryExpanded(story.id)) {
                <div class="border-t border-slate-200 bg-slate-50 p-6">
                  <div class="mb-4 text-sm text-slate-600 font-medium">
                    Tarefas Técnicas ({{ story.tasks.length }})
                  </div>
                  <div class="space-y-3">
                    @for (task of story.tasks; track task.id) {
                      <div class="flex items-start gap-3 bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow">
                        <div class="w-6 h-6 rounded border-2 border-slate-300 flex-shrink-0 mt-0.5 bg-slate-50"></div>
                        <div class="flex-1">
                          @if (editingTask() === task.id) {
                            <input
                              type="text"
                              [ngModel]="task.title"
                              (ngModelChange)="handleTaskTitleChange(story.id, task.id, $event)"
                              (blur)="editingTask.set(null)"
                              (keydown.enter)="editingTask.set(null)"
                              class="w-full px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              [autofocus]="true"
                            />
                          } @else {
                            <p class="text-slate-700 text-sm">{{ task.title }}</p>
                          }
                        </div>
                        @if (!isReadOnly) {
                          <div class="flex items-center gap-2">
                            <button
                              (click)="editingTask.set(task.id)"
                              class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Editar tarefa"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                                <path d="m15 5 4 4"/>
                              </svg>
                            </button>
                            <button
                              (click)="handleDeleteTask(story.id, task.id)"
                              class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Excluir tarefa"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 6h18"/>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                              </svg>
                            </button>
                          </div>
                        }
                      </div>
                    }

                    @if (!isReadOnly) {
                      <button
                        (click)="handleAddTask(story.id)"
                        class="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M5 12h14"/>
                          <path d="M12 5v14"/>
                        </svg>
                        <span class="text-sm font-medium">Adicionar Tarefa</span>
                      </button>
                    }
                  </div>
                </div>
              }
            </div>
          }

          @if (!isReadOnly) {
            <button
              (click)="handleAddStory()"
              class="w-full flex items-center justify-center gap-3 py-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors bg-white shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
              <span class="font-medium">Adicionar História de Usuário</span>
            </button>
          }
        </div>

        <div class="flex items-center justify-between gap-4 sticky bottom-0 bg-white border-t border-slate-200 p-6 -mx-8 -mb-8 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10">
          <button
            (click)="onCancel()"
            class="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="m15 9-6 6"/>
              <path d="m9 9 6 6"/>
            </svg>
            <span>{{ isReadOnly ? 'Voltar' : 'Cancelar' }}</span>
          </button>

          @if (!isReadOnly) {
            <div class="flex items-center gap-3">
              <div class="text-sm text-slate-600 font-medium">
                {{ currentEpic().stories.length }} histórias • {{ getTotalTasks() }} tarefas
              </div>
              <button
                (click)="onApprove()"
                class="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 font-bold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                <span>Aprovar e Sincronizar com Jira</span>
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class ReviewStageComponent {
  // Inputs e Outputs
  @Input() set epic(value: Epic) {
    this.currentEpic.set(value);
    const expandedIds = new Set(value.stories.map(s => s.id));
    this.expandedStories.set(expandedIds);
  }
  @Input() isReadOnly: boolean = false;
  @Output() approve = new EventEmitter<Epic>();
  @Output() cancel = new EventEmitter<void>();

  // Estado (Signals)
  currentEpic = signal<Epic>({ id: '', title: '', stories: [] });
  editingEpic = signal(false);
  editingStory = signal<string | null>(null);
  editingTask = signal<string | null>(null);
  expandedStories = signal<Set<string>>(new Set());

  // --- Lógica de Negócio ---

  // Gerenciamento do Épico
  handleEpicTitleChange(newTitle: string) {
    const e = this.currentEpic();
    this.currentEpic.set({ ...e, title: newTitle });
  }

  // Gerenciamento de Histórias
  handleStoryTitleChange(sId: string, title: string) {
    const e = this.currentEpic();
    this.currentEpic.set({ 
      ...e, 
      stories: e.stories.map(s => s.id === sId ? { ...s, title } : s) 
    });
  }

  handleDeleteStory(sId: string) {
    const e = this.currentEpic();
    this.currentEpic.set({ 
      ...e, 
      stories: e.stories.filter(s => s.id !== sId) 
    });
  }

  handleAddStory() {
    const e = this.currentEpic();
    const newStory: UserStory = {
      id: `story-${Date.now()}`,
      title: 'Nova História de Usuário',
      tasks: []
    };
    this.currentEpic.set({ ...e, stories: [...e.stories, newStory] });
    
    // Auto-expandir e focar na nova história
    const expanded = new Set(this.expandedStories());
    expanded.add(newStory.id);
    this.expandedStories.set(expanded);
    this.editingStory.set(newStory.id);
  }

  // Gerenciamento de Tarefas
  handleTaskTitleChange(sId: string, tId: string, title: string) {
    const e = this.currentEpic();
    this.currentEpic.set({ 
      ...e, 
      stories: e.stories.map(s => 
        s.id === sId 
          ? { ...s, tasks: s.tasks.map(t => t.id === tId ? { ...t, title } : t) } 
          : s
      ) 
    });
  }

  handleDeleteTask(sId: string, tId: string) {
    const e = this.currentEpic();
    this.currentEpic.set({ 
      ...e, 
      stories: e.stories.map(s => 
        s.id === sId 
          ? { ...s, tasks: s.tasks.filter(t => t.id !== tId) } 
          : s
      ) 
    });
  }

  handleAddTask(sId: string) {
    const e = this.currentEpic();
    const newTask: Task = { id: `task-${Date.now()}`, title: 'Nova tarefa técnica' };
    this.currentEpic.set({ 
      ...e, 
      stories: e.stories.map(s => 
        s.id === sId 
          ? { ...s, tasks: [...s.tasks, newTask] } 
          : s
      ) 
    });
    this.editingTask.set(newTask.id);
  }

  // Helpers de Interface
  toggleStoryExpanded(id: string) {
    const ex = new Set(this.expandedStories());
    ex.has(id) ? ex.delete(id) : ex.add(id);
    this.expandedStories.set(ex);
  }

  isStoryExpanded(id: string) { 
    return this.expandedStories().has(id); 
  }

  getTotalTasks(): number {
    return this.currentEpic().stories.reduce((acc, s) => acc + s.tasks.length, 0);
  }

  onApprove() { 
    this.approve.emit(this.currentEpic()); 
  }

  onCancel() { 
    this.cancel.emit(); 
  }
}