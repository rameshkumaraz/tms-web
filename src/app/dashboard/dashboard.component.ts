import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('worldchart ', { static: false }) chart;

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
  merchantInactiveChangeCount: number;
  locChangeCount: number;
  locInactiveChangeCount: number;
  deviceChangeCount: number;
  deviceInactiveChangeCount: number;
  activeDeviceChange: number;

  merchantChangeText: string;
  locationChangeText: string;
  deviceChangeText: string;
  activeDeviceChangeText: string;

  merchantCountByCountry = {};


  locCountByMerchant = {};
  dvcCountByMerchant = {};

  inactiveLocCountByMerchant = {};
  inactiveDvcCountByMerchant = {};

  isRefreshed = false;

  chartData = [
    ['Country', 'Merchants']
  ];

  mapOptions = {
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

  public geoChart: GoogleChartInterface = {
    chartType: GoogleChartType.GeoChart,
    dataTable: this.chartData,
    options: {
      backgroundColor: '#00000',
      datalessRegionColor: '#00000',
      defaultColor: '#00000',
      colorAxis: { colors: ['#1653da', '#007bff', '#353d9f'] },
      // resolution: 'provinces',
      // displayMode: 'markers',
      height: 450,
      width: 770,
      legend: 'none'
    },
  };

  public geoChart1: GoogleChartInterface = {
    chartType: GoogleChartType.GeoChart,
    dataTable: this.chartData,
    options: {
      backgroundColor: '#00000',
      datalessRegionColor: '#00000',
      defaultColor: '#00000',
      colorAxis: { colors: ['#1653da', '#007bff', '#353d9f'] },
      // resolution: 'provinces',
      // displayMode: 'markers',
      height: 450,
      width: 770,
      legend: 'none'
    },
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

    this.merchantInactiveChangeCount = 0;
    this.locInactiveChangeCount = 0;
    this.deviceInactiveChangeCount = 0;

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
          this.handleMerchantCounts();
          // this.spinner.hide();
          this.loadLocations();
          this.loadDevices();

          this.merchants.sort(function (a, b) {
            return b.locationCount - a.locationCount || b.deviceCount - a.deviceCount;
          })
        },
        error => {
          this.spinner.hide();
        });
  }

  loadLocations() {
    this.locationService.getAllWithRelations()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Location Response', resp);
          this.locations = resp.message;
          this.locCount = this.locations.length;
          this.handleLocationCounts();
          // this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        });
  }

  loadDevices() {
    this.deviceService.getAllWithRelations()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Device Response', resp);
          this.devices = resp.message;
          this.deviceCount = this.devices.length;
          this.handleDeviceCounts();

          this.populateChartData();
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        });
  }

  handleMerchantCounts() {
    this.merchants.forEach(m => {
      if (m.status == this.statusEnum.ACTIVE) {
        if (this.checkDate(Date.parse(m.createdDate)) || this.checkDate(Date.parse(m.updatedDate))) {
          this.merchantChangeCount++;
        }
      } else {
        if (this.checkDate(Date.parse(m.updatedDate))) {
          this.merchantInactiveChangeCount++;
        }
      }
    });

    console.log('Merchant counts', this.merchantChangeCount + ' : ' + this.merchantInactiveChangeCount);
  }

  handleLocationCounts() {
    this.locations.forEach(l => {
      let mId = '' + l.merchant.id;
      if (l.status == this.statusEnum.ACTIVE) {
        if (this.checkDate(Date.parse(l.createdDate)) || this.checkDate(Date.parse(l.updatedDate))) {
          this.locChangeCount++;
          if (!this.locCountByMerchant[mId])
            this.locCountByMerchant[mId] = 1;
          else
            this.locCountByMerchant[mId] = +this.locCountByMerchant[mId] + 1;
        }
      } else {
        if (this.checkDate(Date.parse(l.updatedDate))) {
          this.locInactiveChangeCount++;
          if (!this.inactiveLocCountByMerchant[mId])
            this.inactiveLocCountByMerchant[mId] = 1;
          else
            this.inactiveLocCountByMerchant[mId] = +this.inactiveLocCountByMerchant[mId] + 1;
        }
      }
    });

    console.log('Location count by merchant', this.locCountByMerchant);
    console.log('Inactive Location count by merchant', this.inactiveLocCountByMerchant);

  }

  handleDeviceCounts() {

    this.devices.forEach(d => {

      let mId = '' + d.merchant.id;

      if (d.status == this.statusEnum.ACTIVE) {
        if (this.checkDate(Date.parse(d.createdDate)) || this.checkDate(Date.parse(d.updatedDate))) {
          this.deviceChangeCount++;
          this.activeDeviceCount++;
          if (!this.dvcCountByMerchant[mId])
            this.dvcCountByMerchant[mId] = 1;
          else
            this.dvcCountByMerchant[mId] = this.dvcCountByMerchant[mId] + 1;
        }
      } else {
        if (this.checkDate(Date.parse(d.updatedDate))) {
          this.deviceInactiveChangeCount++;
          if (!this.inactiveDvcCountByMerchant[mId])
            this.inactiveDvcCountByMerchant[mId] = 1;
          else
            this.inactiveDvcCountByMerchant[mId] = this.inactiveDvcCountByMerchant[mId] + 1;
        }
      }

    });

    console.log('Device count by merchant', this.dvcCountByMerchant);
    console.log('Inactive Device count by merchant', this.inactiveDeviceCount);
  }

  populateChartData() {

    this.merchants.forEach(m => {
      if (this.merchantCountByCountry[m.country])
        this.merchantCountByCountry[m.country] = this.merchantCountByCountry[m.country] + 1;
      else
        this.merchantCountByCountry[m.country] = 1;
    });

    Object.keys(this.merchantCountByCountry).forEach(k => {
      this.chartData.push([k, this.merchantCountByCountry[k]]);
    });

    // let deviceByMerchant =[];

    // this.merchants.forEach(m => {
    //   let data = {
    //     merchant : m.name,
    //     country: m.country,
    //     deviceCount: 0
    //   }
    //   this.devices.forEach(d => {
    //       console.log(m.id+'==='+d.merchant.id);
    //       if(m.id === d.merchant.id){
    //         data.deviceCount = data.deviceCount +1;
    //       }
    //   });
    //   this.chartData.push([data.country, data.deviceCount]);

    //   deviceByMerchant.push(data);
    // });

    this.isRefreshed = true;

    // console.log('Device by merchant: ', this.chartData);
  }

  changeMerchant() {
    Object.keys(this.merchantCountByCountry).forEach(k => {
      this.chartData.push([k, this.merchantCountByCountry[k]]);
    });
  }

  changeCountry(country: string) {
    console.log(country);
    this.chartData = [
      ['Country', 'Merchants']
    ];
    if (this.merchantCountByCountry[country])
      this.chartData.push([country, this.merchantCountByCountry[country]]);
    else
      this.chartData.push([country, '0']);

    this.geoChart['dataTable'] = this.chartData;

    console.log(this.geoChart);

    if (this.isRefreshed) {
      this.isRefreshed = false;
      this.geoChart1['dataTable'] = this.chartData;
    } else {
      this.isRefreshed = true;
      this.geoChart['dataTable'] = this.chartData;
    }

    // console.log(this.chartData);  
    // this.chartData = Object.assign([], this.chartData);
    // console.log(this.chart);
    // this.chart.redraw();
  }

  drawChart() {

    console.log(this.chart);

    this.chart.redraw();
  }

  filterMerchant(id: number) {
    return this.merchants.find(m => m.id == id);
  }

  openMerchant(id: number) {
    this.appService.loadMerchant(this.filterMerchant(id));
    this.appService.initMerchantSession(this.filterMerchant(id));
    this.router.navigate(['/mdb']);
  }

  openLocation(id: number) {
    this.appService.loadMerchant(this.filterMerchant(id));
    this.appService.initMerchantSession(this.filterMerchant(id));
    this.router.navigate(['/location']);
  }

  openDevice(id: number) {
    this.appService.loadMerchant(this.filterMerchant(id));
    this.appService.initMerchantSession(this.filterMerchant(id));
    this.router.navigate(['/device']);
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
