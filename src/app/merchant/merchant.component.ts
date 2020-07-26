import { Component, OnInit } from '@angular/core';
import { faPlus, faBars, faTh, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { MerchantService } from './merchant.service';
import { User } from '../model/user';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { LoginNotificationService } from '../shared/service/login-notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent implements OnInit {

  faPlus = faPlus;
  faBars = faBars;
  faTh = faTh;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  pageHeader: string;
  page = 1;
  pageSize = 5;

  mode = 1;

  user: User;

  merchants: Array<any>;
  merchantCount = 0;

  constructor(private merchantService: MerchantService,
    private loginNotifyService: LoginNotificationService,
    private spinner: NgxSpinnerService,
    private router: Router) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    this.pageHeader = 'Merchant';
    this.onLoad();
    this.loginNotifyService.events$.pipe(first())
    .subscribe(
      resp => {
        this.user = resp;
        this.onLoad();
      });
  }

  onLoad() {
    if (!this.user) {
      return;
    }
    this.spinner.show();
    this.merchantService.getMerchants(this.user.id)
      .pipe(first())
      .subscribe(
        resp => {
          console.log('Merchant Response', resp);
          this.merchants = resp.body;
          for (const merchant of this.merchants) {
            merchant.viewApin = false;
            merchant.viewLpin = false;
          }
          this.merchantCount = this.merchants.length;
          this.spinner.hide();
        },
        error => {
        });
  }

  changeView() {
    this.mode = this.mode === 1 ? 2 : 1;
  }

  editMerchant(){
    this.router.navigate(['/merchantForm']);
  }

  onToggleAeccessIcon(id: number) {
    for (const merchant of this.merchants){
      if (merchant.id === id){
        merchant.viewApin = merchant.viewApin === true ? false : true;
      }
  }
  }

  onToggleLoginIcon(id: number) {
    for (const merchant of this.merchants){
      if (merchant.id === id){
        merchant.viewLpin = merchant.viewLpin === true ? false : true;
      }
    }
  }
}
