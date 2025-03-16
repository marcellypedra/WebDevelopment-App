import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShiftsResponse } from '../models/shiftsresponse.model';
import { ShiftsResponseForDate } from '../models/shiftsresponsefordate.model';

@Injectable({
  providedIn: 'root',
})
export class RosterService {
  private url = 'http://localhost:5200';
  constructor(private httpclient: HttpClient) {}

  getShiftsForUser(userId: string): Observable<ShiftsResponse> {
    return this.httpclient.get<ShiftsResponse>(`${this.url}/user/${userId}`);
  }

  getShiftsByDate(dateSelected: string): Observable<ShiftsResponseForDate[]> {
    return this.httpclient.get<any[]>(`${this.url}/date/${dateSelected}`);
  }
}
