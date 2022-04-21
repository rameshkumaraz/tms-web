import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../../../app.config';

@Injectable({
  providedIn: 'root'
})
export class ResetPassService {

  appSettings = AppSettings;

  constructor(private client: HttpClient) { }

  updatePass(formValue: any){
    const headers = { 'content-type': 'application/json' }

    let url = this.appSettings.API_CONTEXT + this.appSettings.ENDPOINTS.password.endpoint + "/" + this.appSettings.ENDPOINTS.password.path.reset;

    return this.client.put(url, JSON.stringify(formValue), { 'headers': headers });
  }
}
