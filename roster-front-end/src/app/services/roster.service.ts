import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShiftsResponse } from '../types/response.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RosterService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getShiftForUser(userId: string): Observable<ShiftsResponse> {
    //const token = sessionStorage.getItem('ROSTER-AUTH'); 
    return this.http.get<ShiftsResponse>(`${this.apiUrl}/shifts/user/${userId}`, {
      //headers: { Authorization: `Bearer ${token}` }, 
      withCredentials: true,
    });
  } 
}
