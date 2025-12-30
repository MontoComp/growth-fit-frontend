import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  register(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.api}/auth/register`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.api}/auth/login`, data);
  }

  public getCurrentRole(): string {
    let result = null;
    const currentUser = localStorage.getItem('token');
    if(currentUser){
        const decodeJwtData = this.getDecodedAccessToken(currentUser);
        result = decodeJwtData?.role;
    }
    return result;
  }

  getDecodedAccessToken(token: any) {
    const jwtData = token?.split('.')[1];
    const decodedJwtJsonData = jwtData && window.atob(jwtData);
    return decodedJwtJsonData && JSON.parse(decodedJwtJsonData);
  }
}
