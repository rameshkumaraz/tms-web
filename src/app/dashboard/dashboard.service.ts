import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';
import { BaseService } from '../shared/core/base.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {

  constructor(private client: HttpClient) {
    super(client, 'dashboard');
  }

  loadMerchantStats() {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.dashboard.endpoint +
      '/' + AppSettings.ENDPOINTS.dashboard.path.merchant;
    return this.getByCustomUrl(apiUrl);
  }

  loadLocationStats() {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.dashboard.endpoint +
      '/' + AppSettings.ENDPOINTS.dashboard.path.location; 
    return this.getByCustomUrl(apiUrl);
  }

  loadDeviceStats() {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.dashboard.endpoint +
      '/' + AppSettings.ENDPOINTS.dashboard.path.device;    
    return this.getByCustomUrl(apiUrl);
  }
}
