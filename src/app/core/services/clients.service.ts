import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getClientsByGym(gymId: string): Observable<any> {
    return this.http.get<any[]>(`${this.api}/clients/${gymId}`);
  }

  createClient(client: any): Observable<any> {
    return this.http.post(`${this.api}/clients`, client);
  }

  updateClient(id: number, client: any): Observable<any> {
    return this.http.put(`${this.api}/clients/${id}`, client);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.api}/clients/${id}`);
  }

  getClientsByGymWithStatus(gymId: string): Observable<any> {
    return this.http.get<any[]>(`${this.api}/clients/${gymId}/status`);
  }
}
