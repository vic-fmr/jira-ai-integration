import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Epic, UserStory, Task } from '../../models/jira-ia.models';
import { JiraApiService} from '../../services/jira-api.service';
import { finalize } from 'rxjs';

// @ts-ignore
@Component({
  selector: 'app-review-stage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-stage.component.html',
  styleUrl: './review-stage.component.scss'
})
export class ReviewStageComponent {
  // **1. Injeção do Serviço:**
  private jiraService = inject(JiraApiService);

  // **Adicionado: Estado para feedback visual**
  isSyncing = signal(false);

  @Input() set epic(value: Epic) {
    this.currentEpic.set(value);
    if (value.stories.length > 0) {
      this.expandedStories.set(new Set([value.stories[0].id]));
    }
  }
  @Input() projectKey: string = '';
  @Input() isReadOnly: boolean = false;
  // O seu Output 'approve' pode ser mantido, mas a lógica de chamada vai para o onApprove local.
  @Output() approveSuccess = new EventEmitter<void>(); // Se quiser emitir sucesso após a chamada.
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

  handleAddStory() {
    const newStory: UserStory = {
      id: Date.now().toString(),
      title: '',
      priority: 'Medium',
      complexity: 'Unknown',
      userStoryFormat: 'Como [persona], eu quero [ação] para que [benefício]',
      acceptanceCriteria: [],
      dependencies: [],
      tasks: []
    };

    this.currentEpic.update(e => ({
      ...e,
      stories: [...e.stories, newStory]
    }));

    this.toggleStoryExpanded(newStory.id);
  }

  handleDeleteStory(sId: string) {
    this.currentEpic.update(e => ({
      ...e,
      stories: e.stories.filter(s => s.id !== sId)
    }));
  }
  
  onApprove() {
    if (this.isSyncing()) {
      return; // Evita cliques duplicados
    }

    this.isSyncing.set(true); // Inicia o estado de loading

    this.jiraService.syncWithJira(this.currentEpic(), this.projectKey)
      .pipe(
        // O `finalize` é ótimo para garantir que o estado de loading seja desligado, mesmo em erro.
        finalize(() => this.isSyncing.set(false))
      )
      .subscribe({
        next: (response) => {
          console.log('Sincronização com Jira bem-sucedida!', response);
          alert('As tarefas foram criadas no Jira com sucesso!');
          this.approveSuccess.emit(); // Emite um evento de sucesso
        },
        error: (err) => {
          console.error('Erro ao sincronizar com Jira:', err);
          alert('Falha ao criar tarefas no Jira. Verifique o console.');
          // Você pode querer reemitir o erro ou tratar de outra forma.
        }
      });
  }

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

  getTotalTasks(): number {
    return this.currentEpic().stories.reduce((acc, story) => acc + (story.tasks?.length || 0), 0);
  }
}