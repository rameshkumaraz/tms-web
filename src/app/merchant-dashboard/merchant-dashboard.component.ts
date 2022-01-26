import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Merchant } from '../model/merchant';
import { BaseComponent } from '../shared/core/base.component';
import { AppService } from '../shared/service/app.service';

@Component({
  selector: 'app-merchant-dashboard',
  templateUrl: './merchant-dashboard.component.html',
  styleUrls: ['./merchant-dashboard.component.scss']
})
export class MerchantDashboardComponent extends BaseComponent {

  pageHeader: string;

  merchant : Merchant;

  mSub;

  locations: Array<any>;
  devices: Array<any>;

  activeDeviceCount = 0;
  inactiveDeviceCount = 0;

  locCount = 0;
  deviceCount = 0;

  locChangeCount = 0;
  deviceChangeCount = 0;
  activeDeviceChange = 0;

  locationChangeText: string;
  deviceChangeText: string;

  constructor(private appService: AppService,
    private spinner: NgxSpinnerService,
    private router: Router) { 
      super(null);
    }
  

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

    this.activeDeviceCount = 0;
    this.inactiveDeviceCount = 0;
  
    this.locCount = 0;
    this.deviceCount = 0;
  
    this.locChangeCount = 0;
    this.deviceChangeCount = 0;
    this.activeDeviceChange = 0;
  }

  onPageLoad() {
  }

  ngOnDestroy(): void {
    this.mSub.remove;
  }

}
