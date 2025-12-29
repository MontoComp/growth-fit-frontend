import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlansService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getListPlans(gymId: string): Observable<any> {
    return this.http.get(`${this.api}/plans/${gymId}`);
  }
}
