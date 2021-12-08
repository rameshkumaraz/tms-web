import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { MerchantService } from 'src/app/merchant/merchant.service';
import { RolesEnum } from 'src/app/utils/guards/roles.enum';
import { AuthenticationService } from 'src/app/utils/services';
import { ApiResponse } from '../model/api.response';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private userMerchantSubject = new BehaviorSubject<any>({});
  public userMerchant = this.userMerchantSubject.asObservable();

  constructor(
    private authService: AuthenticationService,
    private merchantService: MerchantService) {
    // console.log('AppService constructor.....');
    // this.authService.currentUser.subscribe(data => {
    //   console.log("Subscription log....", data);
    //   if (!data) {
    //   } else {
        this.loadUserMerchant();
      // }
    // });
  }

  loadUserMerchant() {

    this.authService.currentUser.subscribe(data => {
      console.log("Subscription log....", data);
      if (!data) {
      } else {
        console.log("Merchant getting loaded....");
        return this.merchantService.getMerchant(data.merchantId).pipe(first()).subscribe((resp: ApiResponse) => {
          console.log('Loaded Merchant.....', resp);
          this.userMerchantSubject.next(resp.message);
        },
          err => {
            console.log('Merchant Error Response', err);
            this.userMerchantSubject.next({});
          });
      }
    });
  }

  clearUserMerchant() {
    console.log("Merchant getting loaded....");
    this.userMerchantSubject.next({});
  }

}
