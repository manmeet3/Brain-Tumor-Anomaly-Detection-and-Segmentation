import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'

const API_URL = environment.API_URL;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'test/all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'test/user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'test/mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'test/admin', { responseType: 'text' });
  }

  createScan(scan: any): Observable<any>{
    return this.http.post(API_URL + 'createScan', scan);
  }

  getScans(): Observable<any>{
    return this.http.get(API_URL + 'getScans');
  }

  viewModelResults(scanId): Observable<any>{
    return this.http.post(API_URL + 'viewModelResults', scanId);
  }

  getModelResults(scanId): Observable<any>{
    return this.http.post(API_URL + 'getModelResults', scanId);
  }

  getInactiveUsers(): Observable<any>{
    return this.http.get(API_URL + 'getInactiveUsers');
  }

  setUsersActive(users: string[]): Observable<any>{
    return this.http.put(API_URL + 'active', users);
  }
}
