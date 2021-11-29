import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';
import { AppService } from '../shared/service/app.service';
import { Device } from '../model/device';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient,
    private appService: AppService) { }

  getAll() {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.device;
    return this.http.get(apiUrl);
  }

  getAllForLocation(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.devicesForLocation + 
      '/' + id;
    console.log(apiUrl);  
    return this.http.get(apiUrl);
  }

  get(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.device + "/" + id;
    console.log("API Url", apiUrl);
    return this.http.get(apiUrl);
  }

  create(device: Device) {
    console.log("Merchant for create....", JSON.stringify(device));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.device;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.post(apiUrl, JSON.stringify(device), { 'headers': headers });
  }

  update(device: Device) {

    console.log("Merchant for update....", JSON.stringify(device));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.device;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.put(apiUrl, JSON.stringify(device), { 'headers': headers });
  }

  delete(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.device + "/" + id;

    console.log('API URL:', apiUrl);

    return this.http.delete(apiUrl);
  }


}
