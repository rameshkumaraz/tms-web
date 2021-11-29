import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';
import { Application } from '../model/application';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private http: HttpClient) { }

  getAll() {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.application;
    return this.http.get(apiUrl);
  }

  getAllByMerchant(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.applicationsForMerchant + "/" + id;
    return this.http.get(apiUrl);
  }

  getById(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.application + "/" + id;
    console.log("API Url", apiUrl);
    return this.http.get(apiUrl);
  }

  create(dto: Application) {
    console.log("Application for create....", JSON.stringify(dto));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.application;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.post(apiUrl, JSON.stringify(dto), { 'headers': headers });
  }

  update(dto: Application) {

    console.log("Application for update....", JSON.stringify(dto));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.application;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.put(apiUrl, JSON.stringify(dto), { 'headers': headers });
  }

  delete(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.application + "/" + id;

    console.log('API URL:', apiUrl);

    return this.http.delete(apiUrl);
  }
}
