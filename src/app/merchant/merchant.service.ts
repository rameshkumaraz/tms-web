import { Injectable } from '@angular/core';
import { Merchant } from '../model/merchant';

import mockData from '../../assets/config/mock-data.json';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  constructor() { }

  getMerchants(){

    return mockData.merchants;

  }
}
