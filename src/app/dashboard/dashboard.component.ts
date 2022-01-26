import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from '../shared/service/app.service';
import menuAccess from '../../assets/config/menu-access.json';
import { BaseComponent } from '../shared/core/base.component';

import { GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';

import { countries } from '../shared/model/country-data-store'
import { MerchantService } from '../merchant/merchant.service';
import { first } from 'rxjs/operators';
import { ApiResponse } from '../shared/model/api.response';
import { LocationService } from '../location/location.service';
import { DeviceService } from '../device/device.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent {

  pageHeader: string;

  countries: any = countries;

  merchants: Array<any>;
  locations: Array<any>;
  devices: Array<any>;

  activeDeviceCount: number;
  inactiveDeviceCount: number;

  merchantCount: number;
  locCount: number;
  deviceCount: number;

  merchantChangeCount: number;
  locChangeCount: number;
  deviceChangeCount: number;
  activeDeviceChange: number;

  merchantChangeText: string;
  locationChangeText: string;
  deviceChangeText: string;



  chartData = [
    ['Country', 'Merchants'],
    ['India', 10],
    ['Nepal', 2],
    ['France', 2],
  ];

  public geoChart: GoogleChartInterface = {
    chartType: GoogleChartType.GeoChart,
    dataTable: this.chartData,
    options: {
      backgroundColor: '#00000',
      datalessRegionColor: '#00000',
      defaultColor: '#00000',
      colorAxis: { colors: ['#00F919', '#0FFFE4', '#1FA20F'] },
      // resolution: 'provinces',
      // displayMode: 'markers',
      height: 450,
      width: 770,
      legend: 'none'
    }
  };

  constructor(private appService: AppService,
    private merchantService: MerchantService,
    private locationService: LocationService,
    private deviceService: DeviceService,
    private spinner: NgxSpinnerService,
    private router: Router) {
    super(null);
  }

  ngOnInit(): void {
    this.pageHeader = 'Dashboard';

    this.merchantCount = 0;
    this.locCount = 0;
    this.deviceCount = 0;

    this.merchantChangeCount = 0;
    this.locChangeCount = 0;
    this.deviceChangeCount = 0;
    this.activeDeviceChange = 0;

    this.activeDeviceCount = 0;
    this.inactiveDeviceCount = 0

    this.appService.clearMerchant();
    // this.resetMenuAccess();
    this.onPageLoad();
  }

  onPageLoad() {
    this.spinner.show();
    this.merchantService.getAll()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Merchant Response', resp);
          this.merchants = resp.message;
          this.merchantCount = this.merchants.length;
          this.merchants.forEach(m => {
            console.log("Created date....", m.createdDate);
            if (this.checkDate(Date.parse(m.createdDate))) {
              this.merchantChangeCount++;
            }
          });
          if (this.merchantChangeCount > 0) {
            this.merchantChangeText = '+ ' + this.merchantChangeCount;
          } else {
            this.merchantChangeText = '' + this.merchantChangeCount;
          }
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        });

    this.loadLocations();
    this.loadDevices();
  }

  loadLocations() {
    this.locationService.getAll()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Location Response', resp);
          this.locations = resp.message;
          this.locCount = this.locations.length;
          this.locations.forEach(l => {
            console.log("Created date....", l.createdDate);
            if (this.checkDate(Date.parse(l.createdDate))) {
              this.locChangeCount++;
            }
          });
          if (this.locChangeCount > 0) {
            this.locationChangeText = '+ ' + this.locChangeCount;
          } else {
            this.locationChangeText = '' + this.locChangeCount;
          }
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        });
  }

  loadDevices() {
    this.deviceService.getAll()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Device Response', resp);
          this.devices = resp.message;
          this.deviceCount = this.devices.length;
          this.devices.forEach(d => {
            if (d.status === 1) {
              this.activeDeviceCount++;
            } else {
              if (this.checkDate(Date.parse(d.updatedDate))) {
                this.activeDeviceChange++;
              }
            }
            if (this.checkDate(Date.parse(d.createdDate))) {
              this.deviceChangeCount++;
            }
          });
          if (this.deviceChangeCount > 0) {
            this.deviceChangeText = '+ ' + this.deviceChangeCount;
          } else {
            this.deviceChangeText = '' + this.deviceChangeCount;
          }
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        });
  }

  resetMenuAccess() {
    Object.keys(menuAccess).forEach(function (key) {
      menuAccess[key] = false;
    });
  }

  checkDate(date: number) {
    let fDate = new Date();
    fDate.setDate(fDate.getMonth() - 1);
    let tDate = new Date();
    //console.log(date +" : "+ tDate.getTime() +" : "+ fDate.getTime());
    if ((date <= tDate.getTime() && date >= fDate.getTime())) return true
    return false;
  }

}
