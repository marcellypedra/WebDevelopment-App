import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shift } from '../types/response.type';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ShiftService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Fetch employees (assuming User model with _id and name)
  getAllUsers(): Observable<{users: { _id: string; name: string }[]}> {
    const token = sessionStorage.getItem('ROSTER-AUTH'); 
    return this.http.get<{ users:{_id: string; name: string }[]}>(`${this.apiUrl}/users`, {  
      headers: { 'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` }, 
        withCredentials: true,
    });
  }

  // Save shift data
  saveShifts(shifts: any[]): Observable<any> {
    const token = sessionStorage.getItem('ROSTER-AUTH');  
    return this.http.post(`${this.apiUrl}/shifts`, shifts, { 
      headers: { 'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` }, 
        withCredentials: true,
    });
  
    
  }
}