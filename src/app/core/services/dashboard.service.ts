import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getMetrics(): Observable<any> {
    return this.http.get(`${this.api}/dashboard/metrics`);
  }
}
