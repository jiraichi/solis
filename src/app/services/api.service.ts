import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Months } from '../interfaces/angle';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = 'https://l1zxnfptyk.execute-api.ap-southeast-1.amazonaws.com/dev';

  constructor(
    private http: HttpClient
  ) { }


  getAngles(lat, long): Observable<Months> {
    const url = `${this.apiUrl}/angle?latitude=${lat}&longitude=${long}`;
    return this.http.get<Months>(url);
  }

  getSkyConditions(lat: string, lng: string, start: string, end: string, mode: string) {
    const url = `${this.apiUrl}/sky?latitude=${lat}&longitude=${lng}&start=${start}&end=${end}&mode=${mode}`;
    return this.http.get(url);
  }

  getSolarIrradience(lat: string, lng: string, start: string, end: string) {
    const url = `${this.apiUrl}/irradiance?latitude=${lat}&longitude=${lng}&start=${start}&end=${end}`;
    return this.http.get(url);
  }

}
