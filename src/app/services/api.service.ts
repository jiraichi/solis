import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Months } from '../interfaces/angle';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = 'https://l1zxnfptyk.execute-api.ap-southeast-1.amazonaws.com/dev/solar';

  constructor(
    private http: HttpClient
  ) { }

  getAngles(lat, long): Observable<Months> {
    const url = `${this.apiUrl}/angle?latitude=${lat}&longitude=${long}`;
    return this.http.get<Months>(url);
  }

}
