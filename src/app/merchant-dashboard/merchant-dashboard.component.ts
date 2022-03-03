import { Component} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { DeviceBrandService } from '../device-brand/device-brand.service';
import { DeviceService } from '../device/device.service';
import { JobService } from '../job/job.service';
import { LocationService } from '../location/location.service';
import { Merchant } from '../model/merchant';
import { BaseComponent } from '../shared/core/base.component';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';

import { GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';

@Component({
  selector: 'app-merchant-dashboard',
  templateUrl: './merchant-dashboard.component.html',
  styleUrls: ['./merchant-dashboard.component.scss']
})
export class MerchantDashboardComponent extends BaseComponent {

  pageHeader: string;

  merchant: Merchant;

  mSub;

  locations: Array<any>;
  devices: Array<any>;
  brands: Array<any>;
  models: Array<any>;
  events: Array<any>;

  locCount = 0;
  deviceCount = 0;
  activeDeviceCount = 0;
  inactiveDeviceCount = 0;

  locChangeCount = 0;
  deviceChangeCount = 0;
  activeDeviceChange = 0;
  inactiveDeviceChange = 0;

  locationChangeText: string;
  deviceChangeText: string;
  activeDeviceChangeText: string;
  inactiveDeviceChangeText: string;

  chartData = [];

  public pieChart: GoogleChartInterface;

  isMapReady = false;

  constructor(private appService: AppService,
    private locationService: LocationService,
    private deviceService: DeviceService,
    private brandService: DeviceBrandService,
    private jobservice: JobService,
    private spinner: NgxSpinnerService) {
    super();
  }


  ngOnInit(): void {
    this.pageHeader = 'Dashboard';

    this.mSub = this.appService.userMerchant.subscribe(data => {
      this.spinner.show();
      // console.log('User Merchant.....', data.id+':'+Object.keys(data).length);
      if (Object.keys(data).length > 0) {
        this.merchant = data;
        this.onPageLoad();
        this.spinner.hide();
      }
    });

    this.locCount = 0;
    this.deviceCount = 0;
    this.activeDeviceCount = 0;
    this.inactiveDeviceCount = 0;

    this.locChangeCount = 0;
    this.deviceChangeCount = 0;
    this.activeDeviceChange = 0;
    this.inactiveDeviceChange = 0;

    this.locationChangeText = '';
    this.deviceChangeText = '';
    this.activeDeviceChangeText = '';
    this.inactiveDeviceChangeText = '';

  }

  onPageLoad() {
    this.spinner.show();
    this.loadLocations();
    this.loadDevices();
    // this.loadDeviceBrands();
    // this.loadDeviceModels();
    this.loadJobs();
  }

  loadLocations() {
    this.locationService.getByMerchant(this.merchant.id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Location Response', resp);
          this.locations = resp.message;
          this.locCount = this.locations.length;
          this.locations.forEach(l => {
            //console.log("Created date....", l.createdDate);
            if (this.checkDate(Date.parse(l.createdDate))) {
              this.locChangeCount++;
            }
          });
          if (this.locChangeCount > 0) {
            this.locationChangeText = '+ ' + this.locChangeCount;
          } else {
            this.locationChangeText = '' + this.locChangeCount;
          }
          
        },
        error => {
          console.log('Location Response', error);
          this.spinner.hide();
        });
  }

  loadDevices() {
    this.deviceService.findByMerchant(this.merchant.id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Device Response', resp);
          this.devices = resp.message;
          this.deviceCount = this.devices.length;
          this.devices.forEach(d => {
            if (this.checkDate(Date.parse(d.createdDate))) {
              this.deviceChangeCount++;
            }
            if (d.status === 1) {
              this.activeDeviceCount++;
              if (this.checkDate(Date.parse(d.createdDate)) || this.checkDate(Date.parse(d.updatedDate))) {
                this.activeDeviceChange++;
              }
            } else {
              this.inactiveDeviceCount++;
              if (this.checkDate(Date.parse(d.updatedDate))) {
                this.inactiveDeviceChange++;
              }
            }

          });
          if (this.deviceChangeCount > 0) {
            this.deviceChangeText = '+ ' + this.deviceChangeCount;
          } else {
            this.deviceChangeText = '' + this.deviceChangeCount;
          }

          if (this.activeDeviceChange > 0) {
            this.activeDeviceChangeText = '+ ' + this.activeDeviceChange;
          } else {
            this.activeDeviceChangeText = '' + this.activeDeviceChange;
          }

          if (this.inactiveDeviceChange > 0) {
            this.inactiveDeviceChangeText = '+ ' + this.inactiveDeviceChange;
          } else {
            this.inactiveDeviceChangeText = '' + this.inactiveDeviceChange;
          }

          this.loadDeviceModels();

          // this.spinner.hide();
        },
        error => {
          console.log('Device Response', error);
          this.spinner.hide();
        });
  }

  loadDeviceBrands() {
    this.brandService.getAll()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Brand Response', resp);
          this.brands = resp.message;
          // this.spinner.hide();
        },
        error => {
          console.log('Brand Response', error);
          this.spinner.hide();
        });
  }

  loadDeviceModels() {
    this.chartData.push(['Model', 'Device Count']);
    let chartDeviceData = {};
    this.devices.forEach(d => {
      if (chartDeviceData[d.model.name])
        chartDeviceData[d.model.name] = chartDeviceData[d.model.name] + 1;
      else
        chartDeviceData[d.model.name] = 1;
    });

    Object.keys(chartDeviceData).forEach(d => {
      this.chartData.push([d, chartDeviceData[d]]);
    });

    console.log('Device Data', this.chartData);

    this.pieChart = {
      chartType: GoogleChartType.PieChart,
      dataTable: this.chartData,
      options: {
        height: 300,
        chartArea: { left: 20, top: 20, right: 0, bottom: 0 },
        legend: 'none',
        pieSliceText: 'label'
      },
    };

    this.isMapReady = true;

    // this.modelService.getAll()
    //   .pipe(first())
    //   .subscribe(
    //     (resp: ApiResponse) => {
    //       console.log('Model Response', resp);
    //       this.models = resp.message;
    //       this.chartData.push(['Model', 'Device Count']);
    //       this.models.forEach(m => {
    //         this.chartData.push([m.name, m.deviceCount]);
    //       });

    //       this.pieChart = {
    //         chartType: GoogleChartType.PieChart,
    //         dataTable: this.chartData,
    //         //firstRowIsData: true,
    //         options: {
    //           height: 300,
    //           chartArea: {left: 20, top: 20, right: 0, bottom: 0},
    //           legend: 'none',
    //           pieSliceText: 'label'
    //         },
    //       };

    //       this.isMapReady = true;

    //       // this.brandCount = this.brands.length;
    //       this.spinner.hide();
    //     },
    //     error => {
    //       console.log('Modle Response', error);
    //       this.spinner.hide();
    //     });
  }

  loadJobs() {
    this.jobservice.getByMerchant(this.merchant.id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Jobs Response', resp);
          this.events = resp.message;
          this.spinner.hide();
        },
        error => {
          console.log('Jobs Response', error);
          this.spinner.hide();
        });
  }

  loadEventLogs(){
    
  }

  ngOnDestroy(): void {
    this.mSub.remove;
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
