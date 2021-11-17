import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../model/api.response';


@Injectable({
  providedIn: 'root'
})
export class ResponseHandlerService {

  apiResponse: ApiResponse;

  constructor() { }

  handleResponse(response: any) {
    console.log(response);
    this.apiResponse = new ApiResponse();
    this.apiResponse.message = response.body;
    this.apiResponse.status = 'Success';
    this.apiResponse.code = 200;
    return this.apiResponse;
  }

  handleErrorResponse(error: HttpErrorResponse) {
    this.apiResponse = new ApiResponse();
    this.apiResponse.status = 'Error';
    if(error instanceof HttpErrorResponse) {
      this.apiResponse.code = error.status;
      if(this.apiResponse.code === 401 )
        this.apiResponse.message = "Invalid User name/Password.";
      else {
        this.apiResponse.message = error.message;
      }  
    } else {
      console.log("AppHttpInterceptor - ", error);
      this.apiResponse.code = 500;
      this.apiResponse.message = 'Unable to process your request, please contact administrator.';
    }
    return this.apiResponse;
  }

  handleErrorMessage(errMsg: string, errCode: number) {
    this.apiResponse = new ApiResponse();
    this.apiResponse.message = errMsg;
    this.apiResponse.status = 'Error';
    this.apiResponse.code = errCode;
    return this.apiResponse;
  }
}
