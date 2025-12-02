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
          <h1 class="text-slate-900 mb-2 font-bold text-3xl">
            {{ isReadOnly ? 'Visualização' : 'Revisão do Backlog' }}
          </h1>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div class="flex items-center gap-2 mb-3">
            <div class="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">DOCUMENTO / ÉPICO</div>
          </div>
          <input
            type="text"
            [ngModel]="currentEpic().title"
            (ngModelChange)="handleEpicTitleChange($event)"
            [disabled]="isReadOnly"
            class="w-full px-3 py-2 border-transparent hover:border-slate-300 focus:border-blue-500 rounded-lg text-slate-900 text-2xl font-bold bg-transparent transition-colors"
          />
          <div class="text-sm text-slate-500 mt-2 px-3">
            {{ currentEpic().stories.length }} histórias geradas
          </div>
        </div>

        <div class="space-y-6 mb-8">
          @for (story of currentEpic().stories; track story.id; let storyIndex = $index) {
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">

              <div class="p-6 cursor-pointer hover:bg-slate-50" (click)="toggleStoryExpanded(story.id)">
                <div class="flex items-start gap-4">
                  <div class="mt-1 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         [class.rotate-180]="isStoryExpanded(story.id)" class="transition-transform duration-200">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </div>

                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <span class="font-mono text-xs text-slate-500">STORY-{{storyIndex + 1}}</span>
                      <span [class]="getPriorityClass(story.priority) + ' px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider'">
                         {{ story.priority }}
                       </span>
                      <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                         {{ story.complexity }}
                       </span>
                    </div>
                    <h3 class="text-lg font-semibold text-slate-800">{{ story.title }}</h3>
                  </div>

                  @if (!isReadOnly) {
                    <button (click)="$event.stopPropagation(); handleDeleteStory(story.id)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  }
                </div>
              </div>

              @if (isStoryExpanded(story.id)) {
                <div class="border-t border-slate-200 p-6 space-y-6 bg-slate-50/50">

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Título da Tarefa (Jira)</label>
                      <input type="text" [ngModel]="story.title" (ngModelChange)="updateStory(story.id, 'title', $event)" [disabled]="isReadOnly"
                             class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium">
                    </div>
                    <div class="flex gap-4">
                      <div class="flex-1">
                        <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Prioridade</label>
                        <select [ngModel]="story.priority" (ngModelChange)="updateStory(story.id, 'priority', $event)" [disabled]="isReadOnly"
                                class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm">
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                      <div class="flex-1">
                        <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Complexidade</label>
                        <input type="text" [ngModel]="story.complexity" (ngModelChange)="updateStory(story.id, 'complexity', $event)" [disabled]="isReadOnly"
                               class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                      </div>
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Formato da História</label>
                    <textarea [ngModel]="story.userStoryFormat" (ngModelChange)="updateStory(story.id, 'userStoryFormat', $event)" [disabled]="isReadOnly"
                              rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-white p-4 rounded-lg border border-slate-200">
                      <div class="flex justify-between items-center mb-3">
                        <h4 class="text-xs font-bold text-slate-500 uppercase">Critérios de Aceitação</h4>
                        @if(!isReadOnly) { <button (click)="addItem(story.id, 'acceptanceCriteria')" class="text-xs text-blue-600 hover:underline">+ Adicionar</button> }
                      </div>
                      <ul class="space-y-2">
                        @for (criteria of story.acceptanceCriteria; track $index) {
                          <li class="flex gap-2">
                            <span class="text-green-500 mt-1">✓</span>
                            <input type="text" [ngModel]="criteria" (ngModelChange)="updateListItem(story.id, 'acceptanceCriteria', $index, $event)"
                                   [disabled]="isReadOnly" class="flex-1 text-sm border-0 border-b border-transparent focus:border-blue-300 focus:ring-0 p-0 bg-transparent">
                            @if(!isReadOnly) { <button (click)="removeListItem(story.id, 'acceptanceCriteria', $index)" class="text-slate-300 hover:text-red-500">×</button> }
                          </li>
                        }
                      </ul>
                    </div>

                    <div class="bg-white p-4 rounded-lg border border-slate-200">
                      <div class="flex justify-between items-center mb-3">
                        <h4 class="text-xs font-bold text-slate-500 uppercase">Dependências</h4>
                        @if(!isReadOnly) { <button (click)="addItem(story.id, 'dependencies')" class="text-xs text-blue-600 hover:underline">+ Adicionar</button> }
                      </div>
                      <ul class="space-y-2">
                        @for (dep of story.dependencies; track $index) {
                          <li class="flex gap-2">
                            <span class="text-amber-500 mt-1">⚠</span>
                            <input type="text" [ngModel]="dep" (ngModelChange)="updateListItem(story.id, 'dependencies', $index, $event)"
                                   [disabled]="isReadOnly" class="flex-1 text-sm border-0 border-b border-transparent focus:border-blue-300 focus:ring-0 p-0 bg-transparent">
                            @if(!isReadOnly) { <button (click)="removeListItem(story.id, 'dependencies', $index)" class="text-slate-300 hover:text-red-500">×</button> }
                          </li>
                        }
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div class="flex justify-between items-center mb-3">
                      <label class="text-xs font-semibold text-slate-500 uppercase">Tarefas Técnicas (Subtasks)</label>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
                      @for (task of story.tasks; track task.id) {
                        <div class="flex items-center gap-3 p-3 hover:bg-slate-50">
                          <div class="w-4 h-4 border-2 border-slate-300 rounded bg-slate-50"></div>
                          <input type="text" [ngModel]="task.title" (ngModelChange)="handleTaskTitleChange(story.id, task.id, $event)"
                                 [disabled]="isReadOnly" class="flex-1 text-sm bg-transparent border-none focus:ring-0 p-0">
                          @if(!isReadOnly) {
                            <button (click)="handleDeleteTask(story.id, task.id)" class="text-slate-300 hover:text-red-500 p-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
                            </button>
                          }
                        </div>
                      }
                      @if(!isReadOnly) {
                        <button (click)="handleAddTask(story.id)" class="w-full py-2 text-sm text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                          <span>+ Adicionar Tarefa Técnica</span>
                        </button>
                      }
                    </div>
                  </div>

                </div>
              }
            </div>
          }
        </div>

        <div class="flex items-center justify-between gap-4 sticky bottom-0 bg-white border-t border-slate-200 p-6 -mx-8 -mb-8 rounded-t-2xl shadow-lg z-10">
          <button (click)="onCancel()" class="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancelar</button>
          @if (!isReadOnly) {
            <button (click)="onApprove()" class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg shadow-blue-600/20">
              Aprovar e Criar no Jira
            </button>
          }
        </div>

      </div>
    </div>
  `
})
export class ReviewStageComponent {
  @Input() set epic(value: Epic) {
    this.currentEpic.set(value);
    // Expandir apenas a primeira história por padrão
    if (value.stories.length > 0) {
      this.expandedStories.set(new Set([value.stories[0].id]));
    }
  }
  @Input() isReadOnly: boolean = false;
  @Output() approve = new EventEmitter<Epic>();
  @Output() cancel = new EventEmitter<void>();

  currentEpic = signal<Epic>({ id: '', title: '', stories: [] });
  expandedStories = signal<Set<string>>(new Set());

  // --- Actions ---

  toggleStoryExpanded(id: string) {
    const ex = new Set(this.expandedStories());
    ex.has(id) ? ex.delete(id) : ex.add(id);
    this.expandedStories.set(ex);
  }

  isStoryExpanded(id: string) { return this.expandedStories().has(id); }

  handleEpicTitleChange(title: string) {
    this.currentEpic.update(e => ({ ...e, title }));
  }

  // Generic Update for simple fields
  updateStory(storyId: string, field: keyof UserStory, value: any) {
    this.currentEpic.update(e => ({
      ...e,
      stories: e.stories.map(s => s.id === storyId ? { ...s, [field]: value } : s)
    }));
  }

  // List Items Management (Criteria / Dependencies)
  updateListItem(storyId: string, listField: 'acceptanceCriteria' | 'dependencies', index: number, value: string) {
    this.currentEpic.update(e => ({
      ...e,
      stories: e.stories.map(s => {
        if (s.id !== storyId) return s;
        const list = [...(s[listField] || [])];
        list[index] = value;
        return { ...s, [listField]: list };
      })
    }));
  }

  addItem(storyId: string, listField: 'acceptanceCriteria' | 'dependencies') {
    this.currentEpic.update(e => ({
      ...e,
      stories: e.stories.map(s => {
        if (s.id !== storyId) return s;
        return { ...s, [listField]: [...(s[listField] || []), 'Novo item'] };
      })
    }));
  }

  removeListItem(storyId: string, listField: 'acceptanceCriteria' | 'dependencies', index: number) {
    this.currentEpic.update(e => ({
      ...e,
      stories: e.stories.map(s => {
        if (s.id !== storyId) return s;
        const list = [...(s[listField] || [])];
        list.splice(index, 1);
        return { ...s, [listField]: list };
      })
    }));
  }

  // Task Management
  handleTaskTitleChange(sId: string, tId: string, title: string) {
    this.currentEpic.update(e => ({
      ...e,
      stories: e.stories.map(s => s.id === sId
        ? { ...s, tasks: s.tasks.map(t => t.id === tId ? { ...t, title } : t) }
        : s)
    }));
  }

  handleAddTask(sId: string) {
    const newTask: Task = { id: `new-${Date.now()}`, title: 'Nova tarefa técnica' };
    this.currentEpic.update(e => ({
      ...e,
      stories: e.stories.map(s => s.id === sId ? { ...s, tasks: [...s.tasks, newTask] } : s)
    }));
  }

  handleDeleteTask(sId: string, tId: string) {
    this.currentEpic.update(e => ({
      ...e,
      stories: e.stories.map(s => s.id === sId ? { ...s, tasks: s.tasks.filter(t => t.id !== tId) } : s)
    }));
  }

  handleDeleteStory(sId: string) {
    this.currentEpic.update(e => ({
      ...e,
      stories: e.stories.filter(s => s.id !== sId)
    }));
  }

  onApprove() { this.approve.emit(this.currentEpic()); }
  onCancel() { this.cancel.emit(); }

  // Helpers UI
  getPriorityClass(p: string) {
    switch(p) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-amber-100 text-amber-700';
      case 'Low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  }
}
