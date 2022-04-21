import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';
import { BaseService } from '../shared/core/base.service';

@Injectable({
  providedIn: 'root'
})
export class MerchantDashboardService extends BaseService {

  constructor(private client: HttpClient) {
    super(client, 'mdashboard');
  }

  loadLocationStats(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.mdashboard.endpoint +
      '/' + AppSettings.ENDPOINTS.mdashboard.path.location +
      '/' + id;
      
    return this.getByCustomUrl(apiUrl);
  }

  loadDeviceStats(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.mdashboard.endpoint +
      '/' + AppSettings.ENDPOINTS.mdashboard.path.device +
      '/' + id;    
    return this.getByCustomUrl(apiUrl);
  }

  loadJobStats(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.mdashboard.endpoint +
      '/' + AppSettings.ENDPOINTS.mdashboard.path.job +
      '/' + id;    
    return this.getByCustomUrl(apiUrl);
  }
  
  loadDeviceModelStats(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.mdashboard.endpoint +
      '/' + AppSettings.ENDPOINTS.mdashboard.path.model +
      '/' + id;    
    return this.getByCustomUrl(apiUrl);
  }

  loadCategoryStats(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.mdashboard.endpoint +
      '/' + AppSettings.ENDPOINTS.mdashboard.path.category +
      '/' + id;    
    return this.getByCustomUrl(apiUrl);
  }
}
