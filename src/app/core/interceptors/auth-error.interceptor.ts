import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        // 1. Limpia sesión
        localStorage.removeItem('token');

        // 2. Redirige al login
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
