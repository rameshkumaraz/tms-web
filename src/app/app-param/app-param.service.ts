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

  getByMerchant(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.appParam.endpoint + 
      '/' + AppSettings.ENDPOINTS.appParam.path.merchant + 
      '/' + id;
    // console.log(apiUrl);
    return this.getByCustomUrl(apiUrl);
  }

  getRelation(){
    return this.relation;
  }

  setRelation(merchant: number, app: number){
    this.relation.merchant = merchant;
    this.relation.app = app;
  }

  getMockPramConfig(){
      return this.client.get("./assets/config/mock-param-config.json");
  }
}
