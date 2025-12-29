import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getPayments(clientId: string): Observable<any> {
    return this.http.get(`${this.api}/payments/${clientId}`);
  }

  createPayment(payment: any): Observable<any> {
    return this.http.post(`${this.api}/payments`, payment);
  }

  renewPayment(payment: any): Observable<any> {
    return this.http.post(`${this.api}/payments/renew`, payment);
  }

  updatePayment(id: string, payment: any): Observable<any> {
    return this.http.put(`${this.api}/payments/${id}`, payment);
  }

  deletePayment(id: string): Observable<any> {
    return this.http.delete(`${this.api}/payments/${id}`);
  }
}
