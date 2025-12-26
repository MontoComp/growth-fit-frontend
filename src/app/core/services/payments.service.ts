import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getPayments(clientId: string) {
    return this.http.get<any[]>(`${this.api}/payments/client/${clientId}`);
  }

  createPayment(data: {
    client_id: string;
    amount: number;
    paid_until: string;
  }) {
    return this.http.post(`${this.api}/payments`, data);
  }
}
