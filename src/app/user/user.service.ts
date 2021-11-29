import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAllUsers() {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.user;
    return this.http.get(apiUrl);
  }

  getAdminUsers() {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.usersForAdmin;
    return this.http.get(apiUrl);
  }

  getUsersForMerchant(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.usersForMerchant + 
      '/' + id;
    console.log(apiUrl);  
    return this.http.get(apiUrl);
  }

  getUser(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.user + "/" + id;
    console.log("API Url", apiUrl);
    return this.http.get(apiUrl);
  }
}
