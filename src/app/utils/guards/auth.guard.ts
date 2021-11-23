import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';
import {RolesEnum} from './roles.enum'

@Injectable()
export class AuthGuard implements CanActivate {

    // constructor(private router: Router) { }

    // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    //     console.log('AuthGaurd', sessionStorage.getItem('user_profile'));

    //     if (sessionStorage.getItem('user_profile')) {
    //         // logged in so return true
    //         return true;
    //     }

    //     // not logged in so redirect to login page with the return url
    //     this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    //     return false;

    //     // return true;
    // }

    constructor(
        private router: Router,
        private authService: AuthenticationService
    ) { }
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.authService.isAuthorized()) {
            this.router.navigate(['login']);
            return false;
        }

        const roles = route.data.roles as any[];
        // console.log("UserRole....",this.authService.getRole());
        if (roles && !roles.some(r => this.authService.hasRole(r))) {
            this.router.navigate(['/error']);
            return false;
        }
        return true;
    }
    canLoad(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.authService.isAuthorized()) {
            return false;
        }
        console.log("CanLoad....",route.data.roles);
        const roles = route.data.roles && route.data.roles as RolesEnum[];
        if (roles && !roles.some(r => this.authService.hasRole(r))) {
            return false;
        }
        return true;
    }
}
