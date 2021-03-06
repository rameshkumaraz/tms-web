import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Merchant } from '../model/merchant';
import { environment } from '../../environments/environment';
import mockData from '../../assets/config/mock-data.json';
import { AppMockDataService } from '../utils/services/app-mock-data.service';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AppSettings } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  merchants: Array<Merchant>;

  constructor(private mockDataService: AppMockDataService,
    private http: HttpClient) { }

  getAllMerchants() {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.merchant;
    return this.http.get(apiUrl);
  }

  getMerchant(id: number) {

    if (environment.mockResponse) {
      this.mockDataService.getMerchants().forEach(merchant => {
        // console.log('Merchant', merchant);
        if (merchant.user === id) {
          // console.log('Merchants for user id' + id, merchant.merchants);
          this.merchants = merchant.merchants;
        }
      });

      return of(new HttpResponse({ status: 200, body: this.merchants })).pipe(
        delay(environment.mockResponseDelay || 100));
    }
    else {
      // return this.http.post(apiUrl, bodyJSON, { observe: 'response' });
      const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.merchant + "/" + id;
      console.log("API Url", apiUrl);
      return this.http.get(apiUrl);
    }

  }
  createMerchant(merchant: Merchant) {
    console.log("Merchant for create....", JSON.stringify(merchant));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.merchant;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.post(apiUrl, JSON.stringify(merchant), { 'headers': headers });
  }

  updateMerchant(merchant: Merchant) {

    console.log("Merchant for update....", JSON.stringify(merchant));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.merchant;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.put(apiUrl, JSON.stringify(merchant), { 'headers': headers });
  }

  deleteMerchant(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.merchant + "/" + id;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    return this.http.delete(apiUrl);
  }
}
