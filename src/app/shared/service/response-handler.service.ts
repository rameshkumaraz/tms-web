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
    this.apiResponse = new ApiResponse();
    this.apiResponse.message = response;
    this.apiResponse.status = 'Success';
    this.apiResponse.code = 200;
    return this.apiResponse;
  }

  handleErrorResponse(error: HttpErrorResponse) {
    this.apiResponse = new ApiResponse();
    this.apiResponse.status = 'Error';
    // if(error.error.code)
    //     apiResponse.code = error.error.code;
    // else 
    //     apiResponse.code = 500;

    // if(error.error.status === 401){
    //     apiResponse.message = "Invalid User name/Password.";
    // } else {
    //     if(error.error.message)
    //         apiResponse.message = error.error.message;
    //     else 
    //         apiResponse.message = 'Unable to process you request, please contact administrator.';
    // }
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
