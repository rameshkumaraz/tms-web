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

  getAllForApplication(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.librariesForLocation + "/" + id;
    return this.http.get(apiUrl);
  }

  getLatestForApplication(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.latestForLocation + "/" + id;
    return this.http.get(apiUrl);
  }

  getById(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.library + "/" + id;
    console.log("API Url", apiUrl);
    return this.http.get(apiUrl);
  }

  create(formData: FormData) {
    console.log("Library for create....", formData);
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.library;

    console.log('API URL:', apiUrl);
    // const headers = { 'content-type': 'application/json' }

    return this.http.post(apiUrl, formData);
  }

  update(formData: FormData) {

    console.log("Library for update....", JSON.stringify(formData));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.library;

    console.log('API URL:', apiUrl);
    // const headers = { 'content-type': 'application/json' }

    return this.http.put(apiUrl, formData);
  }

  delete(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.library + "/" + id;

    console.log('API URL:', apiUrl);

    return this.http.delete(apiUrl);
  }
}
