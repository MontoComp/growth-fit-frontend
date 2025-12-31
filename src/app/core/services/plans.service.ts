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

  createPlan(client: any): Observable<any> {
    return this.http.post(`${this.api}/plans`, client);
  }

  updatePlan(id: number, client: any): Observable<any> {
    return this.http.put(`${this.api}/plans/${id}`, client);
  }

  deletePlan(id: number): Observable<any> {
    return this.http.delete(`${this.api}/plans/${id}`);
  }
}
