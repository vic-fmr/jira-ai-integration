import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent
  ],
  template: `
    <div class="flex min-h-screen bg-slate-50">
      
      <app-sidebar></app-sidebar>

      <main class="flex-1 ml-16 w-full p-6">
        
        <router-outlet></router-outlet>
        
      </main>
    </div>
  `
})
export class MainLayoutComponent {}