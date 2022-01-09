import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Merchant } from '../model/merchant';
import { AppSettings } from '../app.config';
import { BaseService } from '../shared/core/base.service';

@Injectable({
  providedIn: 'root'
})
export class MerchantService extends BaseService {

  constructor(private client: HttpClient) {
    super(client, 'merchant');
  }
}
