import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { UserResponse } from '../types/user-response.type';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

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
          sessionStorage.setItem('ROSTER-AUTH', response.accessToken);
        })
      );
  }
  
  logout() {
    sessionStorage.removeItem('ROSTER-AUTH');
    sessionStorage.removeItem('refreshToken');
    this.router.navigate(['/login']).then(() => {
      window.location.reload(); // Ensures the user is fully logged out
    });
  }
   
  refreshToken(): Observable<string> {
    return this.http
      .post<{ accessToken: string }>(`${this.apiUrl}/auth/refreshToken`, {}, 
      { withCredentials: true } // Ensure cookies are sent
    ).pipe(
        tap(response => {
            sessionStorage.setItem('ROSTER-AUTH', response.accessToken);
        }),
        map(response => response.accessToken)
    );
  }
  
  getUserIdFromToken(): string | null {
    const token = sessionStorage.getItem('ROSTER-AUTH');
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.id || null; 
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  register(userData: any): Observable<any> {
    const token = sessionStorage.getItem('ROSTER-AUTH'); 
    return this.http.post(`${this.apiUrl}/auth/register`, userData, {
      headers: { 'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` }, 
        withCredentials: true,
    });
  }  

  getUsers(): Observable<any[]> {
    const token = sessionStorage.getItem('ROSTER-AUTH'); 
    return this.http.get<any[]>(`${this.apiUrl}/users`, {
      headers: { Authorization: `Bearer ${token}` }, 
      withCredentials: true,
    });
  }

  getUserById(userId: string): Observable<any> {
    const token = sessionStorage.getItem('ROSTER-AUTH'); 
    return this.http.get(`${this.apiUrl}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }, 
        withCredentials: true,
    });
    
  }

  deleteUser(userId: string): Observable<any> {
    const token = sessionStorage.getItem('ROSTER-AUTH'); 
    return this.http.delete(`${this.apiUrl}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }, 
      withCredentials: true,
    });
  }

  updateUser(userId: string, updateData: any): Observable<any> {
    const token = sessionStorage.getItem('ROSTER-AUTH'); 
        
    const isFormData = updateData instanceof FormData;

    return this.http.put(`${this.apiUrl}/users/${userId}`, updateData, {
      headers: isFormData
        ? { Authorization: `Bearer ${token}` } 
        : { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      withCredentials: true, 
    });
  }

  updateUserProfile(userId: string, updatedData: any): Observable<any> {
    const token = sessionStorage.getItem('ROSTER-AUTH'); 
    
    const isFormData = updatedData instanceof FormData;

    return this.http.put(`${this.apiUrl}/users/${userId}`, updatedData, {
      headers: isFormData
        ? { Authorization: `Bearer ${token}` } 
        : { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
  }

  getUserProfile(userId: string): Observable<any> {
    const token = sessionStorage.getItem('ROSTER-AUTH'); 
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }, 
      withCredentials: true,
    });
  }  
  
  loadUserProfile(userId: string): Observable<any> {
    const token = sessionStorage.getItem('ROSTER-AUTH'); 
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }, 
      withCredentials: true,
    });
  }
  
  searchUsers(query: string): Observable<any> {
    console.log('Search query:', query);
    const token = sessionStorage.getItem('ROSTER-AUTH'); 
    return this.http.get<any>(`${this.apiUrl}/users/search`, { 
      params: { search: query }, 
      headers: { Authorization: `Bearer ${token}` }, 
      withCredentials: true,
    });
  }  

  isManager(): boolean {
    const token = sessionStorage.getItem('ROSTER-AUTH'); 
    return sessionStorage.getItem('roleType') === 'Manager';
  }
}