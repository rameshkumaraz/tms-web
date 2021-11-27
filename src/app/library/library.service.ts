import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';
import { Library } from '../model/library';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor(private http: HttpClient) { }

  getAll() {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.library;
    return this.http.get(apiUrl);
  }

  getById(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.library + "/" + id;
    console.log("API Url", apiUrl);
    return this.http.get(apiUrl);
  }

  create(dto: Library) {
    console.log("Library for create....", JSON.stringify(dto));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.library;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.post(apiUrl, JSON.stringify(dto), { 'headers': headers });
  }

  update(dto: Library) {

    console.log("Library for update....", JSON.stringify(dto));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.library;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.put(apiUrl, JSON.stringify(dto), { 'headers': headers });
  }

  delete(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.library + "/" + id;

    console.log('API URL:', apiUrl);

    return this.http.delete(apiUrl);
  }
}
