import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { AppMockDataService } from '../services/app-mock-data.service';

import { AppSettings } from '../../app.config';
import { environment } from '../../../environments/environment';
import { User } from 'src/app/model/user';
import { ResponseHandlerService } from '../../shared/service/response-handler.service';
import { ApiResponse } from 'src/app/shared/model/api.response';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    // constructor(private http: HttpClient) {
    //     this.currentUserSubject = new BehaviorSubject<Profile>(JSON.parse(localStorage.getItem('currentUser')));
    //     this.currentUser = this.currentUserSubject.asObservable();
    // }

    constructor(private http: HttpClient,
        private mockDataService: AppMockDataService,
        private responseHandler: ResponseHandlerService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(bodyJSON) {
        const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.login;

        console.log('API URL:', apiUrl);

        if (environment.mockResponse) {
            let user;
            this.mockDataService.getUsers().forEach(mockUser => {
                if (!user) {
                    if (mockUser.email === bodyJSON.email && mockUser.password === bodyJSON.password) {
                        user = mockUser;
                    }
                }
            });
            if (!user){
                // return of(new HttpResponse({ status: 401, body: 'Invalid email / password' })).pipe(
                //     delay(environment.mockResponseDelay || 100));
                return of(this.responseHandler.handleResponse({ status: 401, body: 'Invalid email / password' })).pipe(
                    delay(environment.mockResponseDelay || 100));    
            }
            // return of(new HttpResponse({ status: 200, body: user})).pipe(
            //     delay(environment.mockResponseDelay || 100));
            return of(this.responseHandler.handleResponse({ status: 200, body: user})).pipe(
                    delay(environment.mockResponseDelay || 100));
        }
        else {
            console.log('Login body: ', bodyJSON);
            // return this.http.post(apiUrl, bodyJSON).subscribe(data => {
            //     return of(this.responseHandler.handleResponse(data));
            // })
            // return of(new HttpResponse({ status: 500, body: 'Yet to be implemented' })).pipe(delay(environment.mockResponseDelay || 100));
            return this.http.post(apiUrl, bodyJSON);
        }
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.clear();
        localStorage.clear();
        this.currentUserSubject.next(null);
    }
}