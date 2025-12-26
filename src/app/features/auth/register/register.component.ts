import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

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

  isLoading = false;

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

  register() {
    if (this.form.invalid) return;

    this.auth.register(this.form.value as any).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
