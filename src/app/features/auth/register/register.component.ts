import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../core/utils/toast.service';
import { ToastModel } from '../../../core/models/toast.model';
import { Position } from '../../../core/constants/position.constant';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  isLoading = signal(false);

  countries = [
    { code: 'PE', prefix: '+51', flag: '🇵🇪' },
    { code: 'EC', prefix: '+593', flag: '🇪🇨' },
    { code: 'CO', prefix: '+57', flag: '🇨🇴' },
    { code: 'MX', prefix: '+52', flag: '🇲🇽' },
  ];

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    dni: ['', [Validators.required, Validators.minLength(8)]],
    country: ['PE', Validators.required],
    phone: ['', Validators.required],
  });

  async register() {
    if (this.form.invalid) return;

    try {
      this.isLoading.set(true);

      await firstValueFrom(this.auth.register(this.form.value as any));
      this.router.navigate(['/login']);
      this.showToastMessageV2('Usuario creado exitosamente', 'SUCCESS');
    } catch (error) {
      console.log('error', error);
      if (error instanceof HttpErrorResponse) {
        if (error.status === 409) {
          this.showToastMessageV2('El correo ingresado ya existe, ingrese uno diferente', 'ERROR');
        }
      } else {
        this.showToastMessageV2('¡Lo sentimos!, Ha ocurrido un error intente nuevamente', 'ERROR');
      }  
    } finally {
      this.isLoading.set(false);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
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
