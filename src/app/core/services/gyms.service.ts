import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GymsService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getGyms(): Observable<any> {
    return this.http.get<any[]>(`${this.api}/gyms`);
  }

  createGym(data: { name: string, address: string }): Observable<any> {
    return this.http.post(`${this.api}/gyms`, data);
  }

  updateGym(id: number, data: { name: string, address?: string }): Observable<any> {
    return this.http.put(`${this.api}/gyms/${id}`, data);
  }

  deleteGym(id: number): Observable<any> {
    return this.http.delete(`${this.api}/gyms/${id}`);
  }
}
