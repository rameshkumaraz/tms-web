import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { AppSettings } from '../../app.config';
import { RolesEnum } from '../guards/roles.enum';
import { User } from 'src/app/model/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('user_profile')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public getCurrentUser(): any {
        return this.currentUserSubject.value;
    }

    isAuthorized() {
        return !!this.currentUserSubject.value;
    }

    hasRole(role: any) {
        // console.log(this.getCurrentUser().roleName+"=="+role);
        return this.isAuthorized() && this.getCurrentUser().roleName == role;
    }

    getRole() {
        return this.currentUserSubject.value.roleName;
    }

    isAdmin() {
        if (this.getRole() == RolesEnum.AZ_ROOT_ADMIN ||
            this.getRole() == RolesEnum.AZ_ADMIN ||
            this.getRole() == RolesEnum.AZ_SUPPORT) {
            return true;
        }
        return false;
    }

    public getAccessToken(): string {
        return sessionStorage.getItem('access_token');
    }

    login(bodyJSON) {
        const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.login;

        // console.log('API URL:', apiUrl);
        // console.log('Login body: ', bodyJSON);
        
        return this.http.post(apiUrl, bodyJSON);
    }

    loadUserProfile() {
        console.log('Loading user profile subject.....');
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