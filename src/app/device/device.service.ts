import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';
import { AppService } from '../shared/service/app.service';
import { Device } from '../model/device';
import { BaseService } from '../shared/core/base.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService extends BaseService {

  constructor(private client: HttpClient,
    private appService: AppService) {
    super(client, 'device');
  }

  findByLocation(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.device.endpoint +
      '/' + AppSettings.ENDPOINTS.device.path.location +
      '/' + id;
    console.log(apiUrl);
    return this.getByCustomUrl(apiUrl);
  }

  findByMerchant(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.device.endpoint +
      '/' + AppSettings.ENDPOINTS.device.path.merchant +
      '/' + id;
    console.log(apiUrl);
    return this.getByCustomUrl(apiUrl);
  }

  getDeviceDetails(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.device.endpoint +
      '/' + AppSettings.ENDPOINTS.device.path.details +
      '/' + id;
    console.log(apiUrl);
    return this.getByCustomUrl(apiUrl);
  }

}
