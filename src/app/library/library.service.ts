import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';
import { Library } from '../model/library';
import { BaseService } from '../shared/core/base.service';

@Injectable({
  providedIn: 'root'
})
export class LibraryService extends BaseService {

  constructor(private client: HttpClient) {
    super(client, 'lib');
   }

  findForApp(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.lib.endpoint +'/'+  AppSettings.ENDPOINTS.lib.path.app + "/" + id;
    return this.getByCustomUrl(apiUrl);
  }

  findLatestForApp(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.lib.endpoint +'/'+  AppSettings.ENDPOINTS.lib.path.appLatest + "/" + id;
    return this.getByCustomUrl(apiUrl);
  }

  findForMerchant(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.lib.endpoint +'/'+  AppSettings.ENDPOINTS.lib.path.merchant + "/" + id;
    return this.getByCustomUrl(apiUrl);
  }

  createLib(formData: FormData) {
    console.log("Library for create....", formData);
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.lib.endpoint;

    console.log('API URL:', apiUrl);
    // const headers = { 'content-type': 'application/json' }

    return this.client.post(apiUrl, formData);
  }
}
