import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';
import { AppService } from '../shared/service/app.service';
import { DeviceBrand } from '../model/device-brand';
import { BaseService } from '../shared/core/base.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceBrandService extends BaseService{

  constructor(private client: HttpClient) {
    super(client, 'deviceBrand');
  }
}
