import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { ResponseHandlerService } from '../../shared/service/response-handler.service';
import { ApiResponse } from '../../shared/model/api.response';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,
        private responseHandler: ResponseHandlerService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<ApiResponse>> {
        const authToken = this.authenticationService.getToken();
        
        if(authToken)
            request = request.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } });

        return next.handle(request).pipe(
            map(resp => {
                if(resp instanceof HttpResponse){
                    resp = resp.clone<any>({ body: this.responseHandler.handleResponse(resp)});
                }
                return resp;
            }),
            catchError(err => {
                return throwError(this.responseHandler.handleErrorResponse(err));
            }))
    }
}