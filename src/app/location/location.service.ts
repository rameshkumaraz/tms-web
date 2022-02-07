import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppSettings } from '../app.config';
import { Location } from '../model/location';
import { BaseService } from '../shared/core/base.service';
import { AppService } from '../shared/service/app.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService extends BaseService {

  constructor(private client: HttpClient) {
    super(client, 'location');
  }

  // getAllLocations() {
  //   const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.location.endpoint;
  //   return this.http.get(apiUrl);
  // }

  getByMerchant(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.location.endpoint +
      '/' + AppSettings.ENDPOINTS.location.path.merchant +
      '/' + id;
    console.log(apiUrl);
    return this.getByCustomUrl(apiUrl);
  }

  getAllWithRelations() {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.location.endpoint +
      '/' + AppSettings.ENDPOINTS.location.path.relations;
    return this.getByCustomUrl(apiUrl);
  }

  searchLocations(filter: any) {
    const headers = { 'content-type': 'application/json' }

    let url = this.apiUrl+ '/' + AppSettings.ENDPOINTS.location.path.filter;

    return this.client.post(url, JSON.stringify(filter), { 'headers': headers });
  }

  // getLocation(id: number) {
  //   const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.location.endpoint + "/" + id;
  //   console.log("API Url", apiUrl);
  //   return this.http.get(apiUrl);
  // }

  // createLocation(location: Location) {
  //   console.log("Merchant for create....", JSON.stringify(location));
  //   const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.location.endpoint;

  //   console.log('API URL:', apiUrl);
  //   const headers = { 'content-type': 'application/json' }

  //   return this.http.post(apiUrl, JSON.stringify(location), { 'headers': headers });
  // }

  // updateLocation(location: Location) {

  //   console.log("Merchant for update....", JSON.stringify(location));
  //   const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.location.endpoint;

  //   console.log('API URL:', apiUrl);
  //   const headers = { 'content-type': 'application/json' }

  //   return this.http.put(apiUrl, JSON.stringify(location), { 'headers': headers });
  // }

  // deleteLocation(id: number) {
  //   const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.location.endpoint + "/" + id;

  //   console.log('API URL:', apiUrl);

  //   return this.http.delete(apiUrl);
  // }

}
