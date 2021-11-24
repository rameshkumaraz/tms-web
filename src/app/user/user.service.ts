import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAllRoles() {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.user;
    return this.http.get(apiUrl);
  }

  getRole(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.user + "/" + id;
    console.log("API Url", apiUrl);
    return this.http.get(apiUrl);
  }
}
