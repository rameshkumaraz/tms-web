import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';
import { AppService } from '../shared/service/app.service';
import { DeviceBrand } from '../model/device-brand';

@Injectable({
  providedIn: 'root'
})
export class DeviceBrandService {

  constructor(private http: HttpClient,
    private appService: AppService) { }

  getAll() {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.deviceBrand;
    return this.http.get(apiUrl);
  }

  getById(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.deviceBrand + "/" + id;
    console.log("API Url", apiUrl);
    return this.http.get(apiUrl);
  }

  create(device: DeviceBrand) {
    console.log("Device brand for create....", JSON.stringify(device));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.deviceBrand;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.post(apiUrl, JSON.stringify(device), { 'headers': headers });
  }

  update(device: DeviceBrand) {

    console.log("Device brand for update....", JSON.stringify(device));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.deviceBrand;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.put(apiUrl, JSON.stringify(device), { 'headers': headers });
  }

  delete(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.deviceBrand + "/" + id;

    console.log('API URL:', apiUrl);

    return this.http.delete(apiUrl);
  }
}
