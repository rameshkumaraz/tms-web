import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, delay, catchError } from 'rxjs/operators';
import { AppMockDataService } from '../services/app-mock-data.service';

import { AppSettings } from '../../app.config';
import { environment } from '../../../environments/environment';
import { User } from 'src/app/model/user';
import { ResponseHandlerService } from '../../shared/service/response-handler.service';
import { AbstractService } from '../../shared/service/abstract.service';
import { ApiResponse } from 'src/app/shared/model/api.response';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    // constructor(private http: HttpClient) {
    //     this.currentUserSubject = new BehaviorSubject<Profile>(JSON.parse(localStorage.getItem('currentUser')));
    //     this.currentUser = this.currentUserSubject.asObservable();
    // }

    constructor(private http: HttpClient,
        private responseHandler: ResponseHandlerService,
        private mockDataService: AppMockDataService) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('user_profile')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public getCurrentUser() : any {
        return this.currentUserSubject.value;
    }

    isAuthorized() {
        return !!this.currentUserSubject.value;
    }

    hasRole(role: any) {
        // console.log(this.getCurrentUser().roleName+"=="+role);
        return this.isAuthorized() && this.getCurrentUser().roleName == role;
    }

    getRole(){
        return this.currentUserSubject.value.roleName;
    }

    public getToken(): string {
        return sessionStorage.getItem('access_token');
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
            if (!user) {
                return of(new HttpResponse({ status: 401, body: 'Invalid email / password' })).pipe(
                    delay(environment.mockResponseDelay || 100),
                    map((data) => {
                        console.log(this.responseHandler);
                        //You can perform some transformation here
                        return data;
                    }));
            }

            return of(new HttpResponse({ status: 200, body: user })).pipe(
                delay(environment.mockResponseDelay || 100),
                map((data) => {
                    console.log(this.responseHandler);
                    //You can perform some transformation here
                    return data;
                }));
        }
        else {
            console.log('Login body: ', bodyJSON);
            return this.http.post(apiUrl, bodyJSON);
        }
    }

    loadUserProfile(){
        console.log();
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('user_profile')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.clear();
        localStorage.clear();
        this.currentUserSubject.next(null);
    }
}