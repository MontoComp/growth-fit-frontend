import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getClientsByGym(gymId: string) {
    return this.http.get<any[]>(`${this.api}/clients/gym/${gymId}`);
  }

  createClient(data: { gym_id: string; name: string; phone?: string }) {
    return this.http.post(`${this.api}/clients`, data);
  }
}
