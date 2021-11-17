import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { ResponseHandlerService } from './response-handler.service';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractService {

  // responseHandler : ResponseHandlerService;

  // constructor(responseHandler: ResponseHandlerService) {
  //     this.responseHandler = responseHandler;
  // }

  // public extractData(res: any) {
  //   console.log('Response: ', res);
  //   console.log(this.responseHandler);
  //   const apiResponse = this.responseHandler.handleResponse(res);
  //   return apiResponse;
  // }

  // public handleErrorObservable(error: any) {
  //   console.error(error.message || error);
  //   return throwError(error);
  // }

  // public handleErrorPromise(error: Response | any) {
  //   console.log(this);
  //   // console.error('Error', error);
  //   // console.error(error.message || error);
  //   const apiResponse = this.responseHandler.handleResponse({ status: 401, body: 'Invalid email / password' });
  //   // return Promise.reject(error.message || error);
  //   return apiResponse;
  // }

  public getJsonTypeHttpHeader() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });

    return httpHeaders;
  }
}
