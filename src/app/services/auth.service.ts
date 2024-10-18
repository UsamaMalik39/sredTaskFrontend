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

  fetchOrganizationsAndRepos(): Observable<any> {
    const token = localStorage.getItem('githubToken');
    return this.http.get(`${this.baseUrl}/auth/organizations`, {
      headers: {
        Authorization: `token ${token}`
      }
    });
  }
  fetchRepositoryInfo(owner: string, repos: string[]): Observable<any> { 
    const token = localStorage.getItem('githubToken');
    return this.http.post(`${this.baseUrl}/auth/repo-info`, { owner, repos }, {
      headers: {
        Authorization: `token ${token}`
      }
    });
  }
}
