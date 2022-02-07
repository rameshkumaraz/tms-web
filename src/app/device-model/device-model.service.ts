import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';
import { AppService } from '../shared/service/app.service';
import { DeviceModel } from '../model/device-model';
import { BaseService } from '../shared/core/base.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceModelService extends BaseService{

  constructor(private client: HttpClient) {
    super(client, 'deviceModel');
  }

  createModel(formData: FormData) {
    console.log("Devicemodel for create....", formData);
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.deviceModel.endpoint;

    console.log('API URL:', apiUrl);
    // const headers = { 'Content-Type': 'multipart/form-data',  'Accept': 'application/json'}
    // headers.append('Content-Type', 'multipart/form-data');
    //     headers.append('Accept', 'application/json');

    return this.client.post(apiUrl, formData);
  }
}
