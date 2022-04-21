import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class ForgotPassService {

  appSettings = AppSettings;

  constructor(private client: HttpClient) { }

  verifyUser(formValue: any){
    const headers = { 'content-type': 'application/json', 'x-api-key': this.appSettings.API_KEY }

    let url = this.appSettings.API_CONTEXT + this.appSettings.ENDPOINTS.password.endpoint + "/" + this.appSettings.ENDPOINTS.password.path.verify;

    return this.client.post(url, JSON.stringify(formValue), { 'headers': headers });
  }

  updatePass(formValue: any){
    const headers = { 'content-type': 'application/json', 'x-api-key': this.appSettings.API_KEY }

    let url = this.appSettings.API_CONTEXT + this.appSettings.ENDPOINTS.password.endpoint + "/" + this.appSettings.ENDPOINTS.password.path.forgot;

    return this.client.put(url, JSON.stringify(formValue), { 'headers': headers });
  }
}
