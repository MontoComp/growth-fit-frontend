import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AppLayoutComponent } from './shared/app-layout/app-layout.component';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  // Rutas de auth sin sidebar
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },

  // Rutas protegidas con sidebar
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'gyms',
        loadComponent: () =>
          import('./features/gyms/gyms-list/gyms-list.component').then((m) => m.GymsListComponent),
      },
      { path: 'gyms/:gymId/clients', loadComponent: () => import('./features/clients/clients-list/clients-list.component').then(m => m.ClientsListComponent) },
      { path: 'gyms/:gymId/clients/:clientId/payments', loadComponent: () => import('./features/payments/payments-list/payments-list.component').then(m => m.PaymentsListComponent) }
    ],
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
