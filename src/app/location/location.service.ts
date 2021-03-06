import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';
import { Location } from '../model/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  getAllLocations() {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.location;
    return this.http.get(apiUrl);
  }

  getLocation(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.location + "/" + id;
    console.log("API Url", apiUrl);
    return this.http.get(apiUrl);
  }

  createLocation(location: Location) {
    console.log("Merchant for create....", JSON.stringify(location));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.location;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.post(apiUrl, JSON.stringify(location), { 'headers': headers });
  }

  updateLocation(location: Location) {

    console.log("Merchant for update....", JSON.stringify(location));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.location;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.put(apiUrl, JSON.stringify(location), { 'headers': headers });
  }

  deleteLocation(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.location + "/" + id;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.delete(apiUrl);
  }
}
