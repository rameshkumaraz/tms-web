import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { Device } from 'src/app/model/device';
import { BaseComponent } from 'src/app/shared/core/base.component';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { DeviceService } from '../device.service';

@Component({
  selector: 'app-device-profile',
  templateUrl: './device-profile.component.html',
  styleUrls: ['./device-profile.component.scss']
})
export class DeviceProfileComponent extends BaseComponent {

  pageHeader = 'Device Profile';

  deviceId: number;

  device: any;

  deviceStatus: string;

  deviceDetails: Array<any>;

  deviceParams: any;

  isLoaded = false;

  constructor(private route: ActivatedRoute,
    private deviceService: DeviceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        console.log(params); 
        this.deviceId = params.id;
        this.onPageLoad();
      });
    
      this.deviceParams = {};
  }

  onPageLoad() {
    this.loadDevice();
    // this.loadDeviceDetails();
  }

  loadDevice() {
    this.spinner.show();
    this.deviceService.getWithRelations(this.deviceId)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Device Response', resp);
          this.device = resp.message;
          this.loadDeviceDetails()
          this.deviceStatus = this.getStatus(this.device.status);
          if(this.device.param){
            this.deviceParams = JSON.parse(this.device.param.params);
          }
          this.isLoaded = true;
          this.spinner.hide();
        },
        error => {
          console.log('Device Response', error);
          this.spinner.hide();
        });
  }

  getParamKeys(){
      return Object.keys(this.deviceParams);
  }

  getParamValueKeys(key: string){
    return Object.keys(this.deviceParams[key]);
  }

  loadDeviceDetails() {
    this.deviceService.getDeviceDetails(this.deviceId)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('DeviceDetails Response', resp);
          this.deviceDetails = resp.message;
          this.spinner.hide();
        },
        error => {
          console.log('DeviceDetails Response', error);
          this.spinner.hide();
        });
  }

}
