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

  getAllDevices() {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.device;
    return this.http.get(apiUrl);
  }

  getdevicesForLocation(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.deviceForLocation + 
      '/' + id;
    console.log(apiUrl);  
    return this.http.get(apiUrl);
  }

  getDevice(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.device + "/" + id;
    console.log("API Url", apiUrl);
    return this.http.get(apiUrl);
  }

  createDevice(device: Device) {
    console.log("Merchant for create....", JSON.stringify(device));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.device;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.post(apiUrl, JSON.stringify(device), { 'headers': headers });
  }

  updateDevice(device: Device) {

    console.log("Merchant for update....", JSON.stringify(device));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.device;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.put(apiUrl, JSON.stringify(device), { 'headers': headers });
  }

  deleteDevice(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.device + "/" + id;

    console.log('API URL:', apiUrl);

    return this.http.delete(apiUrl);
  }


}
