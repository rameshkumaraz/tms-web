import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }

  getAllRoles() {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.role;
    return this.http.get(apiUrl);
  }

  getRole(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.role + "/" + id;
    console.log("API Url", apiUrl);
    return this.http.get(apiUrl);
  }

}
