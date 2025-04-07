import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShiftsResponse } from '../types/response.type';

@Injectable({
  providedIn: 'root',
})
export class RosterService {
  private apiUrl = 'http://localhost:5200';

  constructor(private http: HttpClient) {}

  getShiftForUser(userId: string): Observable<ShiftsResponse> {
    //const token = sessionStorage.getItem('ROSTER-AUTH'); 
    return this.http.get<ShiftsResponse>(`${this.apiUrl}/shifts/user/${userId}`, {
      //headers: { Authorization: `Bearer ${token}` }, 
      withCredentials: true,
    });
  } 
/*
  getUserShiftByDate(dateSelected: string, rangeType: 'day' | 'week' | 'month'): Observable<ShiftsResponse> {
    const token = sessionStorage.getItem('ROSTER-AUTH'); 
    return this.http.get<any>(`${this.apiUrl}/shifts/date/${dateSelected}`, {
      headers: { Authorization: `Bearer ${token}` }, 
      withCredentials: true,
    });
  }

  getTeamShiftbyDate(dateSelected: string, rangeType: 'day' | 'week' | 'month'): Observable<ShiftsResponse> {
    const token = sessionStorage.getItem('ROSTER-AUTH'); 
    return this.http.get<any>(`${this.apiUrl}/shifts/team/${rangeType}/${dateSelected}`, {
      headers: { Authorization: `Bearer ${token}` }, 
      withCredentials: true,
    });
  }  
    */
}
