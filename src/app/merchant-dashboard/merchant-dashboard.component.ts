import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Merchant } from '../model/merchant';
import { AppService } from '../shared/service/app.service';

@Component({
  selector: 'app-merchant-dashboard',
  templateUrl: './merchant-dashboard.component.html',
  styleUrls: ['./merchant-dashboard.component.scss']
})
export class MerchantDashboardComponent implements OnInit, OnDestroy {

  pageHeader: string;

  merchant : Merchant;

  mSub;

  constructor(private appService: AppService,
    private spinner: NgxSpinnerService,
    private router: Router) { }
  

  ngOnInit(): void {
    this.pageHeader = 'Dashboard';

    this.mSub =this.appService.userMerchant.subscribe(data => {
      this.spinner.show();
      // console.log('User Merchant.....', data.id+':'+Object.keys(data).length);
      if(Object.keys(data).length > 0) {
        this.merchant = data;
        this.spinner.hide();
      }
    });
  }

  ngOnDestroy(): void {
    this.mSub.remove;
  }

}
