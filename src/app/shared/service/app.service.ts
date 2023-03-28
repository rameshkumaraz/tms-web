import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { MerchantService } from 'src/app/merchant/merchant.service';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
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
    this.loadMerchantFromUser();
  }

  loadMerchantFromUser() {
    this.authService.currentUser.subscribe(data => {
      //console.log("Subscription log user....", data);
      if (!data) {
      } else {
        if (sessionStorage.getItem('merchant')) {
          this.userMerchantSubject.next(JSON.parse(sessionStorage.getItem('merchant')));
        } else {
          if (data.merchantId) {
            console.log("Merchant getting loaded....");
            return this.merchantService.get(data.merchantId).pipe(first()).subscribe((resp: ApiResponse) => {
              console.log('Loaded Merchant.....', resp);
              this.userMerchantSubject.next(resp.message);
            },
              err => {
                console.log('Merchant Error Response', err);
                this.userMerchantSubject.next({});
              });
          }
        }
      }
    });
  }

  loadMerchant(merchant: any) {
    console.log('Load merchant to sub....', merchant);
    this.userMerchantSubject.next(merchant);
  }

  clearMerchant() {
    console.log("Reset merchant in sub....");
    this.userMerchantSubject.next({});
    this.clearMerchantSession();
  }

  initMerchantSession(merchant: any) {
    sessionStorage.setItem('merchant', JSON.stringify(merchant));
  }

  clearMerchantSession() {
    sessionStorage.removeItem('merchant');
  }

}
