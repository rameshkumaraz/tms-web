import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponse } from '../shared/model/api.response';
import { AppMockDataService } from '../utils/services/app-mock-data.service';
import { ResponseHandlerService } from '../shared/service/response-handler.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor( private mockDataService: AppMockDataService, private responseHandler: ResponseHandlerService ) { }

  // postLogin(bodyJSON): Observable<ApiResponse> {

  //   for ( const user of this.mockDataService.getUsers()){
  //       if (bodyJSON.email === user.email && bodyJSON.password === user.password){
  //         return of(this.responseHandler.handleResponse(user));
  //       }
  //   }

  //   return of(this.responseHandler.handleErrorMessage('Invalid email / password', 401));

  //   // const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.authentication.login;

  //   // return this.http.post(apiUrl, bodyJSON, { observe: 'response' }).pipe(map((resp) => {

  //   //   let currentUser = {
  //   //     profile: resp.body,
  //   //     token: resp.headers.get('authorization')
  //   //   }
  //   //   sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

  //   //   return this.responseHandler.handleResponse(resp);
  //   // })).pipe(catchError((error, caught) => {
  //   //   return of(this.responseHandler.handleErrorResponse(error));
  //   // }) as any);
  //   return null;
  // }
}
