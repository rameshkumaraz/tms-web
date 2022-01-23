import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';
import { BaseService } from '../shared/core/base.service';
import { DynamicFormService } from '../shared/dynamic-form/dynamic-form.service';

@Injectable({
  providedIn: 'root'
})
export class AppParamService extends BaseService {

  relation = {
    merchant: 0,
    app: 0
  };

  constructor(private client: HttpClient) {
    super(client, 'appParam');
  }

  getRelation(){
    return this.relation;
  }

  setRelation(merchant: number, app: number){
    this.relation.merchant = merchant;
    this.relation.app = app;
  }

  // getAll() {
  //   const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.appParam.endpoint;
  //   return this.http.get(apiUrl);
  // };

  // getById(id: number) {
  //   const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.appParam.endpoint + "/" + id;
  //   return this.http.get(apiUrl);
  // };

  // getById(id: number){
  //   const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.appParam.endpoint + "/" + id;
  //   return this.http.get(apiUrl);
  // };

  // create(dto: any) {
    // console.log("Application for create....", JSON.stringify(dto));
    // const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.appParam.endpoint;

    // console.log('API URL:', apiUrl);
    // const headers = { 'content-type': 'application/json' }

    // return this.client.post(apiUrl, JSON.stringify(dto), { 'headers': headers });
    return 
  // };

  // update(dto: any) {
  //   console.log("Application for update....", JSON.stringify(dto));
  //   const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.appParam.endpoint;

  //   console.log('API URL:', apiUrl);
  //   const headers = { 'content-type': 'application/json' }

  //   return this.client.put(apiUrl, JSON.stringify(dto), { 'headers': headers });
  // };

  // delete(id: number) {
  //   const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.appParam.endpoint + "/" + id;

  //   console.log('API URL:', apiUrl);

  //   return this.client.delete(apiUrl);
  // };
}
