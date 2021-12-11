import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';
import { AppService } from '../shared/service/app.service';
import { Job } from '../model/jobs';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: HttpClient,
    private appService: AppService) { }

  getAll() {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.job;
    return this.http.get(apiUrl);
  }

  getAllForMerchant(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.jobForMerchant + "/" + id;
    return this.http.get(apiUrl);
  }

  getById(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.job + "/" + id;
    console.log("API Url", apiUrl);
    return this.http.get(apiUrl);
  }

  create(model: Job) {
    console.log("Merchant for create....", JSON.stringify(model));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.job;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    if(!model.location)
      delete model.location;  
    if(!model.device)
      delete model.device;
    if(!model.library)
      delete model.library;  
    if(!model.app)
      delete model.app;    

    return this.http.post(apiUrl, JSON.stringify(model), { 'headers': headers });
  }

  update(model: Job) {

    console.log("Merchant for update....", JSON.stringify(model));
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.job;

    console.log('API URL:', apiUrl);
    const headers = { 'content-type': 'application/json' }

    if(!model.location)
      delete model.location;  
    if(!model.device)
      delete model.device;
    if(!model.library)
      delete model.library;  
    if(!model.app)
      delete model.app; 

    return this.http.put(apiUrl, JSON.stringify(model), { 'headers': headers });
  }

  delete(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.job + "/" + id;

    console.log('API URL:', apiUrl);

    return this.http.delete(apiUrl);
  }
}
