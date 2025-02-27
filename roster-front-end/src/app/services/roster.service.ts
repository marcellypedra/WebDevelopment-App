import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RosterService {
  private url = '';
  constructor(private httpclient: HttpClient) {}

  getShiftsForUser(userId: string): Observable<any[]> {
    return this.httpclient.get<any[]>(`${this.url}/${userId}`);
  }
}
