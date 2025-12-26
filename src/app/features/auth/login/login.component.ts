import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  showPassword = false;
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.error = '';

    this.auth.login(this.form.value as any).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('email', res.user.email);
        localStorage.setItem('role', res.user.role);
        localStorage.setItem('role_description', res.user.role_description);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Credenciales incorrectas';
        this.isLoading = false;
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
