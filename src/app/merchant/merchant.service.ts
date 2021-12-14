import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Merchant } from '../model/merchant';
import { environment } from '../../environments/environment';
import mockData from '../../assets/config/mock-data.json';
import { AppMockDataService } from '../utils/services/app-mock-data.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AppSettings } from '../app.config';
import { AuthenticationService } from '../utils/services';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  merchants: Array<Merchant>;

  constructor(private mockDataService: AppMockDataService,
    private http: HttpClient) {
  }

  getAllMerchants() {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.merchant;
    return this.http.get(apiUrl);
  }

  getMerchant(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.merchant + "/" + id;
    console.log("API Url", apiUrl);
    return this.http.get(apiUrl);
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
