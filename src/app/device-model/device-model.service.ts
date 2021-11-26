import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';
import { AppService } from '../shared/service/app.service';
import { DeviceModel } from '../model/device-model';

@Injectable({
  providedIn: 'root'
})
export class DeviceModelService {

  constructor(private http: HttpClient,
    private appService: AppService) { }

  getAll() {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.deviceModel;
    return this.http.get(apiUrl);
  }

  getById(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.deviceModel + "/" + id;
    console.log("API Url", apiUrl);
    return this.http.get(apiUrl);
  }

  create(model: DeviceModel) {
    console.log("Merchant for create....", JSON.stringify(model));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.deviceModel;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.post(apiUrl, JSON.stringify(model), { 'headers': headers });
  }

  update(model: DeviceModel) {

    console.log("Merchant for update....", JSON.stringify(model));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.deviceModel;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.put(apiUrl, JSON.stringify(model), { 'headers': headers });
  }

  delete(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.deviceModel + "/" + id;

    console.log('API URL:', apiUrl);

    return this.http.delete(apiUrl);
  }
}
