import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastModel } from '../../../core/models/toast.model';
import { Position } from '../../../core/constants/position.constant';
import { ToastService } from '../../../core/utils/toast.service';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  isLoading = signal(false);
  showPassword = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    if (this.form.invalid) return;

    try {
      this.isLoading.set(true);
      const res = await firstValueFrom(this.auth.login(this.form.value as any));
      localStorage.setItem('token', res.token);
      localStorage.setItem('email', res.user.email);
      localStorage.setItem('role', res.user.role);
      localStorage.setItem('role_description', res.user.role_description);
      this.router.navigate(['/dashboard']);
      this.showToastMessageV2('Inicio de sesión exitoso', 'SUCCESS');
    } catch (error) {
      console.log('error', error);
      this.showToastMessageV2('¡Lo sentimos!, Ha ocurrido un error intente nuevamente', 'ERROR');
    } finally {
      this.isLoading.set(false);
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  private showToastMessageV2(
    message: string,
    state: 'SUCCESS' | 'ERROR' | 'WARNING',
    hideDelay: number = 3000
  ): void {
    const toastModel: ToastModel = {
      type: 'alert-v2',
      viewCloseButton: true,
      viewToast: true,
      position: Position.bottomLeft,
      message: message ?? 'Ocurrió un error inesperado',
      icon: state,
      hideDelay: hideDelay,
    };

    this.toastService.toast$.emit(toastModel);
  }
}
