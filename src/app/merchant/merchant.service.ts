import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Merchant } from '../model/merchant';
import { environment } from '../../environments/environment';
import mockData from '../../assets/config/mock-data.json';
import { AppMockDataService } from '../utils/services/app-mock-data.service';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  merchants: Array<Merchant>;

  constructor(private mockDataService: AppMockDataService) { }

  getMerchants(id: number) {

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
      return of(new HttpResponse({ status: 500, body: [] })).pipe(delay(environment.mockResponseDelay || 100));
    }

  }
}
