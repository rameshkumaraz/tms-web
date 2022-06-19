import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { AppSettings } from '../../app.config';
import { RolesEnum } from '../guards/roles.enum';
import { ModalService } from 'src/app/shared/modal/modal.service';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { map } from 'rxjs/operators';
import compActionAccess from '../../../assets/config/component-action-access.json';
import compActionMapping from '../../../assets/config/component-action-mapping.json';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(private http: HttpClient, private modalService: ModalService) {
        this.currentUserSubject = new BehaviorSubject<any>(null);
        this.currentUser = this.currentUserSubject.asObservable();

        this.loadUserProfile();
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

    hasAccess(policy: any) {
        // console.log(this.getCurrentUser().roleName+"=="+role);
        if (!this.isAuthorized())
            return false;

        if (this.getCurrentUser().roleName == RolesEnum.AZ_ROOT_ADMIN)
            return true;

        console.log('Filtered policy..... ', this.getCurrentUser().policies.find(p => p.name == policy));

        if (this.getCurrentUser().policies.find(p => p.name == policy))
            return true;

        if (this.getCurrentUser().policies.find(p => p.name.indexOf(policy) >= 0))
            return true;

        return false;
    }

    hasAccesses(policies: Array<string>) {
        // console.log(this.getCurrentUser().roleName+"=="+role);
        if (!this.isAuthorized())
            return false;

        if (this.getCurrentUser().roleName == RolesEnum.AZ_ROOT_ADMIN)
            return true;

        policies.forEach(policy => {
            console.log('Filtered policy..... ', this.getCurrentUser().policies.find(p => p.name == policy));

            if (this.getCurrentUser().policies.find(p => p.name == policy))
                return true;

            if (this.getCurrentUser().policies.find(p => p.name.indexOf(policy) >= 0))
                return true;
        });

        return false;
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

        return this.http.post(apiUrl, bodyJSON).pipe(map((resp: ApiResponse) => {
            console.log(resp);
            sessionStorage.setItem('access_token', resp.message.access_token);
            sessionStorage.setItem('user_profile', resp.message.user_profile);
            this.loadUserProfile();
            return resp;
        }));
    }

    refreshToken() {

        console.log('Refresh token initiated.....');

        let userProfile = JSON.parse(sessionStorage.getItem('user_profile'));

        console.log('Refresh token user profile.....', userProfile);

        let isAdmin = false;
        if (userProfile.roleName.indexOf('AZ_') === 0)
            isAdmin = true;
        let req = {
            id: userProfile.id,
            email: userProfile.email,
            lastName: userProfile.lastName,
            isAdmin: isAdmin
        }

        const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.refresh;
        // this.http.post(apiUrl, req).subscribe(resp => {
        //     this.userSubject.next(user);
        //     this.startRefreshTokenTimer();
        // });

        this.stopRefreshTokenTimer();

        const headers = { 'content-type': 'application/json' }

        this.http.post(apiUrl, JSON.stringify(req), { 'headers': headers }).subscribe((resp: ApiResponse) => {
            console.log('Existing Token.....', sessionStorage.getItem('access_token'));
            console.log('Existing Profile', JSON.parse(sessionStorage.getItem('user_profile')));
            console.log(resp);
            sessionStorage.setItem('access_token', resp.message.access_token);
            sessionStorage.setItem('user_profile', resp.message.user_profile);
            console.log('New Token.....', sessionStorage.getItem('access_token'));
            console.log('New Profile', JSON.parse(sessionStorage.getItem('user_profile')));
            this.loadUserProfile();
        },
            err => {
                console.log('Refresh token error', err);
            });
    }

    loadUserProfile() {
        console.log('Loading user profile subject.....', sessionStorage.getItem('user_profile'));
        // this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('user_profile')));
        // this.currentUser = this.currentUserSubject.asObservable();
        if (sessionStorage.getItem('user_profile')) {
            this.startRefreshTokenTimer();
            this.currentUserSubject.next(JSON.parse(sessionStorage.getItem('user_profile')));
            console.log('Loading user profile subject.....', this.currentUserSubject.value);
            this.loadUserCompActionAccess();
        } else {
            this.currentUserSubject.next(null);
        }
        
    }

    loadUserCompActionAccess() {

        for (let key in compActionAccess) {
            for (let aKey in compActionAccess[key]) {
                compActionAccess[key][aKey] = false;
            }
        }

        if (this.getCurrentUser().roleName == RolesEnum.AZ_ROOT_ADMIN) {
            for (let key in compActionAccess) {
                for (let aKey in compActionAccess[key]) {
                    compActionAccess[key][aKey] = true;
                }
            }
        } else {
            console.log('User Policies.....', this.getCurrentUser().policies);
            for (let key in compActionMapping) {
                for (let aKey in compActionMapping[key]) {
                    if (this.getCurrentUser().policies.find(p => p.policyName == compActionMapping[key][aKey]) ||
                        this.getCurrentUser().policies.find(p => p.policyName.indexOf(compActionMapping[key][aKey]) >= 0)) {
                        compActionAccess[key][aKey] = true;
                    }
                }
            }
        }
        console.log('User Policies.....', JSON.stringify(compActionAccess));
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.clear();
        this.stopRefreshTokenTimer();
        //localStorage.clear();
        this.modalService.closeAll();
        this.currentUserSubject.next(null);
    }

    private refreshTokenTimeout;

    private startRefreshTokenTimer() {
        const expiry = (JSON.parse(atob(sessionStorage.getItem('access_token').split('.')[1]))).exp;
        const expires = new Date(expiry * 1000);
        console.log("Token expiry:::::" + expires);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        // const timeout = Date.now() + (60 * 2 * 1000);
        // let dateNow = new Date();
        // dateNow.setTime(timeout);
        // console.log(dateNow + ":::::" + new Date());
        // this.refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}