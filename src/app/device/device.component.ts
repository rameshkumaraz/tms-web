import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive} from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { LocationService } from '../location/location.service';
import { Merchant } from '../model/merchant';
import { Location } from '../model/location';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { DeviceService } from './device.service';
import { ActionEnum } from '../shared/enum/action.enum';
import { ToastrService } from 'ngx-toastr';

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
  locId;

  location: Location;

  merchant: Merchant;

  sub;

  constructor(private appService: AppService,
    private service: DeviceService,
    private locationService: LocationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.pageHeader = 'Devices';

    this.sub = this.activatedroute.paramMap.subscribe(params => {
      console.log(params);
      this.locId = params.get('locId');
    });

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
          if(this.locId)
            this.location = this.locations.find(a => a.id == this.locId);
          else {
            this.location = this.locations[0];
            this.locId = this.location.id;
          }

          if(this.locationCount > 0)
            this.loadDeviceForLocation(this.locations[0].id);
        },
        error => {
          console.log('Location Response', error);
          this.spinner.hide();
        });
  }

  loadDeviceForLocation(id: number){
    this.service.getAllForLocation(id).pipe(first())
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
    this.location =  this.locations.find(x => x.id == id);
    // console.log("Selected app...", this.app);
    this.devices = [];
    this.locId = id;
    this.loadDeviceForLocation(id);
  }

  create() {
    console.log('Add new Library', this.locId);
    this.router.navigate(['/df', { actionType: ActionEnum.add, locId: this.locId}],{skipLocationChange: true});
  }

  view(id: number) {
    console.log("Device id...", id);
    this.router.navigate(['/df', { actionType: ActionEnum.view, id: id}],{skipLocationChange: true});
  }

  edit(id: number) {
    this.router.navigate(['/df', { actionType: ActionEnum.edit, id: id}],{skipLocationChange: true});
  }

  delete(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('Library has been deleted successfully');
      this.toastr.success('Library has been deleted successfully', 'Library');
      this.router.navigate(['/device']);
    },
    err => {
      console.log('Device model delete error....', err);
      this.toastr.success('Unable to delete Library, please contact adminstrator', 'Library');
    });
  }

}
