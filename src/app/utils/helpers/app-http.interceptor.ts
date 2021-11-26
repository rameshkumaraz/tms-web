import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ResponseHandlerService } from '../../shared/service/response-handler.service';
import { ApiResponse } from '../../shared/model/api.response';
import { AppService } from 'src/app/shared/service/app.service';
import { AuthenticationService } from '../services';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
    constructor(private authService: AuthenticationService,
        private responseHandler: ResponseHandlerService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<ApiResponse>> {
        const authToken = this.authService.getAccessToken();
        
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