import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  baseUrl = 'http://localhost:3000'
  connectGitHub(): void {
    window.location.href = `${this.baseUrl}/auth/github`;
  }

  checkStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/status`, { withCredentials: true });
  }

  removeIntegration(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/auth/remove`, { withCredentials: true });
  }
}
