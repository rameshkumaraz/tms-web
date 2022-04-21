import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from '../shared/service/app.service';
import menuAccess from '../../assets/config/menu-access.json';
import { BaseComponent } from '../shared/core/base.component';

import { GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';

import { countries } from '../shared/model/country-data-store'
import { DashboardService } from './dashboard.service';
import { forkJoin } from 'rxjs';

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

  merchantCountByCountry = {};

  mStats: any;
  lStats: any;
  dStats: any;

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
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.pageHeader = 'Dashboard';

    this.appService.clearMerchant();
    // this.resetMenuAccess();
    this.onPageLoad();
  }

  onPageLoad() {
    this.spinner.show();
    forkJoin([
        this.dashboardService.loadMerchantStats(),
        this.dashboardService.loadLocationStats(),
        this.dashboardService.loadDeviceStats()
      ]).subscribe(([resp1 , resp2, resp3]) => {
        let mStats = resp1 as any;
        let lStats = resp2 as any;
        let dStats = resp3 as any;
        this.mStats = mStats.message;
        this.lStats = lStats.message;
        this.dStats = dStats.message;
        this.merchants = this.mStats.merchants;

        this.mStats.mLocChange.forEach(l => {
          this.merchants.forEach(m => {
            if(m.id == l.id)
              m.locActiveCount = l.activeCount;
              m.locInActiveCount = l.inActiveCount;
          });
        });

        this.mStats.mDvscChange.forEach(d => {
          this.merchants.forEach(m => {
            if(m.id == d.id)
              m.dvscActiveCount = d.activeCount;
              m.dvscInActiveCount = d.inActiveCount;
          });
        });

        this.populateChartData();

        this.spinner.hide();
        // console.log('Merchant.....', this.mStats);
        // console.log('Location.....', this.lStats);
        // console.log('Device.....', this.dStats);
        // console.log('Merchants.....', this.merchants);
      },error => {
        this.spinner.hide();
      });
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

    this.isRefreshed = true;

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
  }

  drawChart() {

    console.log(this.chart);

    this.chart.redraw();
  }

  filterMerchant(id: number) {
    return this.mStats.merchants.find(m => m.id == id);
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
