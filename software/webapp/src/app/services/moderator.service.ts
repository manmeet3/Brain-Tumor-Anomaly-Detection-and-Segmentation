import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'

const API_URL = environment.API_URL;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ModeratorService {

  constructor(private http: HttpClient) { }

  getPatients(): Observable<any>{
    return this.http.get(API_URL + 'getPatients');
  }
}