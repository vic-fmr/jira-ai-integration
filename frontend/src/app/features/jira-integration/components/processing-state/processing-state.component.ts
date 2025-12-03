import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-processing-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./processing-state.component.html'
})
export class ProcessingStateComponent {
  @Input() fileName: string = '';
}