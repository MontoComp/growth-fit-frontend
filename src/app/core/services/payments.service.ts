import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getPayments(clientId: number): Observable<any> {
    return this.http.get(`${this.api}/api/clients/${clientId}/payments`);
  }

  createPayment(clientId: number, payment: any): Observable<any> {
    return this.http.post(`${this.api}/api/clients/${clientId}/payments`, payment);
  }

  updatePayment(id: number, payment: any): Observable<any> {
    return this.http.put(`${this.api}/api/clients/payments/${id}`, payment);
  }

  deletePayment(id: number): Observable<any> {
    return this.http.delete(`${this.api}/api/clients/payments/${id}`);
  }
}
