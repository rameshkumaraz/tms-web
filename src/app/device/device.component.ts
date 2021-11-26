import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive} from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { LocationService } from '../location/location.service';
import { Merchant } from '../model/merchant';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { DeviceService } from './device.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {

  faBars = faBars;
  faPlus = faPlus;
  faEye = faEye;
  faEdit = faEdit;
  faArchive = faArchive;
  faTh = faTh;

  pageHeader: string;
  page = 1;
  pageSize = 5;

  deviceCount = 0;
  devices: Array<any>;

  locations: Array<any>;
  locationCount = 0;

  merchant: Merchant;

  constructor(private appService: AppService,
    private deviceService: DeviceService,
    private locationService: LocationService,
    private spinner: NgxSpinnerService,
    private router: Router) { }

  ngOnInit(): void {
    this.pageHeader = 'Devices';
    this.appService.userMerchant.subscribe(data => {
      if(Object.keys(data).length > 0) {
        this.merchant = data;
        this.onLoad();
      }
    });
  }

  onLoad() {
    this.spinner.show();
    this.locationService.getLocationsForMerchant(this.merchant.id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Location Response', resp);
          this.locations = resp.message;
          this.locationCount = this.locations.length;
          this.loadDeviceForLocation(this.locations[0].id);
        },
        error => {
          console.log('Location Response', error);
          this.spinner.hide();
        });
  }

  loadDeviceForLocation(id: number){
    this.deviceService.getdevicesForLocation(id).pipe(first())
    .subscribe(
      (resp: ApiResponse) => {
        console.log('Device Response', resp);
        this.devices = resp.message;
        this.deviceCount = this.devices.length;
        this.spinner.hide();
      },
      error => {
        console.log('Location Response', error);
        this.spinner.hide();
      });
  }

  onLocationChange(id: number){
    this.loadDeviceForLocation(id);
  }

  viewDevice(id: number){
    // this.router.navigate(['/merchantForm']);
  }

  createDevice(){
    // this.router.navigate(['/merchantForm']);
  }

  editDevice(id: number){
    // this.router.navigate(['/merchantForm']);
  }

  deleteDevice(id: number){
    // this.router.navigate(['/merchantForm']);
  }

}
