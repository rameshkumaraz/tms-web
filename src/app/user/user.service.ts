import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';
import { User } from '../model/user';

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

  create(user: User) {
    console.log("User for create....", JSON.stringify(user));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.user;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.post(apiUrl, JSON.stringify(user), { 'headers': headers });
  }

  update(user: User) {

    console.log("User for update....", JSON.stringify(user));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.user;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.put(apiUrl, JSON.stringify(user), { 'headers': headers });
  }

  delete(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.user + "/" + id;

    console.log('API URL:', apiUrl);

    return this.http.delete(apiUrl);
  }
}
