import { Component, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { EBreakpoints, GrowthFitBreakpoints } from '../../core/constants/breakpoints';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);
  public deviceSize = EBreakpoints.LARGE;
  public sidebarOpen = signal(false);

  user = signal({
    email: localStorage.getItem('email') || '-',
    role: localStorage.getItem('role_description') || '-',
  });

  ngOnInit() {
    this.handleBreakPoint();
  }

  private handleBreakPoint() {
  this.breakpointObserver
    .observe([
      GrowthFitBreakpoints.SMALL.breakpoint,
      GrowthFitBreakpoints.MEDIUM.breakpoint,
      GrowthFitBreakpoints.LARGE.breakpoint,
    ])
    .subscribe((state: BreakpointState) => {

      if (state.breakpoints[GrowthFitBreakpoints.LARGE.breakpoint]) {
        this.deviceSize = EBreakpoints.LARGE;
        this.sidebarOpen.set(true);
      } else if (state.breakpoints[GrowthFitBreakpoints.MEDIUM.breakpoint]) {
        this.deviceSize = EBreakpoints.MEDIUM;
        this.sidebarOpen.set(true);
      } else if (state.breakpoints[GrowthFitBreakpoints.SMALL.breakpoint]) {
        this.deviceSize = EBreakpoints.SMALL;
        this.sidebarOpen.set(false);
      }
    });
}


  get isMobile(): boolean {
    return this.deviceSize === EBreakpoints.SMALL;
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  navigate(path: string) {
    this.router.navigate([path]);
    if (this.isMobile) {
      this.sidebarOpen.set(false);
    }
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
