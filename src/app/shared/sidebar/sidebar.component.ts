import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  expanded = false;

  user = signal({
    email: localStorage.getItem('email') || '-',
    role: localStorage.getItem('role_description') || '-',
  });

  ngOnInit() {
        
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('role_description');
    this.router.navigate(['/login']);
  }

  getInitials(): string {
    const email = this.user().email;
    return email ? email[0].toUpperCase() : '?';
  }
}
