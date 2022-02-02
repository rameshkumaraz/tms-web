import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';
import { Application } from '../model/application';
import { BaseService } from '../shared/core/base.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService extends BaseService {

  constructor(private client: HttpClient) {
    super(client, 'app');
  }

  getByMerchant(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.app.endpoint +
      '/' + AppSettings.ENDPOINTS.app.path.merchant +
      '/' + id;
    // console.log(apiUrl);
    return this.getByCustomUrl(apiUrl);
  }

}
