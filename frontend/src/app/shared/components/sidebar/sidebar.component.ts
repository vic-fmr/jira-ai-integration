import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="w-16 bg-slate-900 flex flex-col items-center py-6 border-r border-slate-800 h-screen fixed left-0 top-0">
      <div class="mb-8 flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-500 transition">
        <span class="text-white font-semibold">JI</span>
      </div>
      </aside>
  `
})
export class SidebarComponent {}