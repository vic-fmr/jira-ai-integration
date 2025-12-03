import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-state.component.html'
})
export class SuccessStateComponent {
  @Output() newUpload = new EventEmitter<void>();
  openJira(): void { window.open('https://jira.atlassian.com', '_blank'); }
}