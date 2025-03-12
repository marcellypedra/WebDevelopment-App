import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserResponse } from '../types/user-response.type';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5200';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<UserResponse> {
    return this.http
      .post<UserResponse>(`${this.apiUrl}/auth/login`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          console.log('Login Response:', response);
          sessionStorage.setItem('ROSTER-AUTH', response.token);
          sessionStorage.setItem('ROSTER-ID', response._id);
        })
      );
  }
  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }  

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`, {
      withCredentials: true,
    });
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`, {
      withCredentials: true,
    });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`, {
      withCredentials: true,
    });
  }

  updateUser(userId: string, updateData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}`, updateData, {
      withCredentials: true,
    });
  }

  updateUserProfile(userId: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}`, updatedData, {
      withCredentials: true,
    });
  }

  getUserProfile(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`, {
      withCredentials: true,
    });
  }  

  searchUsers(query: string): Observable<any[]> {
    console.log('Search query:', query);
    console.log('API Response:', Response);

    return this.http.get<any[]>(`${this.apiUrl}/users?search=${query}`, {
      withCredentials: true,
    });
  }

  isManager(): boolean {
    return sessionStorage.getItem('roleType') === 'Manager';
  }
  
}