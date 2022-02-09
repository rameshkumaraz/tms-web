import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive } from '@fortawesome/free-solid-svg-icons';
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
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Device } from '../model/device';
import { BaseComponent } from '../shared/core/base.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DeviceModelService } from '../device-model/device-model.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent extends BaseComponent {

  pageHeader: string;
  page = 1;
  pageSize = 5;

  deviceCount = 0;
  devices: Array<any>;

  deviceModels: Array<any>;

  locations: Array<any>;
  locationCount = 0;

  location: Location;
  device: Device;

  merchant: Merchant;

  mSub;

  actionType;

  closeResult: string;

  constructor(private appService: AppService,
    private dService: DeviceService,
    private locationService: LocationService,
    private dmService: DeviceModelService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private modal: NgbModal,
    private toastr: ToastrService,
    private router: Router) {
    super(modal);
  }

  ngOnInit(): void {
    this.pageHeader = 'Devices';

    // this.sub = this.activatedroute.paramMap.subscribe(params => {
    //   console.log(params);
    //   this.locId = params.get('locId');
    // });

    this.inFilterMode = false;

    this.mSub = this.appService.userMerchant.subscribe(data => {
      if (Object.keys(data).length > 0) {
        this.merchant = data;
        this.onPageLoad();
      }
    });

    this.searchForm = this.formBuilder.group({
      name: [''],
      serial: [''],
      model: [''],
      location: [''],
      status: ['']
    });
  }

  onPageLoad() {
    this.spinner.show();
    this.locationService.getByMerchant(this.merchant.id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Location Response', resp);
          this.locations = resp.message;
          this.locationCount = this.locations.length;

          if (this.locationCount > 0)
            this.loadDevices();
        },
        error => {
          console.log('Location Response', error);
          this.spinner.hide();
        });

    this.loadModels();

  }

  loadModels() {
    this.dmService.getAll()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Device Models Response', resp);
          this.deviceModels = resp.message;
        },
        error => {
          console.log('Device Models Response', error);
        });
  }

  loadDevices() {
    this.dService.findByMerchant(this.merchant.id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Device Response', resp);
          this.devices = resp.message;
          this.deviceCount = this.devices.length;
          this.spinner.hide();
        },
        error => {
          console.log('Device Response', error);
          this.spinner.hide();
        });
  }

  // onLocationChange(id: number) {
  //   this.location = this.locations.find(x => x.id == id);
  //   this.devices = [];
  //   this.loadDeviceForLocation(id);
  // }

  create(content: any) {
    this.actionType = ActionEnum.add;
    this.openModal(content, 'md', 'Device Form');
  }

  view(id: number, content: any) {
    this.actionType = ActionEnum.view;
    this.device = this.filterDevice(id)
    this.openModal(content, 'md', 'Device Form');
  }

  edit(id: number, content: any) {
    this.actionType = ActionEnum.edit;
    this.device = this.filterDevice(id)
    this.openModal(content, 'md', 'Device Form');
  }

  filterDevice(id: number) {
    return this.devices.find(m => m.id == id);
  }

  delete(id: number) {
    this.dService.delete(id).subscribe(data => {
      console.log('Device has been deleted successfully');
      this.toastr.success('Device has been deleted successfully', 'Device');
      this.onPageLoad();
    },
      err => {
        console.log('Device model delete error....', err);
        this.toastr.success('Unable to delete device, please contact adminstrator', 'Device');
      });
  }

  get f() { return this.searchForm['controls'] }

  searchDevices() {
    console.log('Filter', this.searchForm.value);
    let filter = this.searchForm.value;
    filter.merchant = this.merchant.id;
    console.log('Filter', filter);
    if (this.f.name.value || this.f.serial.value || this.f.model.value || this.f.location.value || this.f.status.value) {
      this.spinner.show();
      this.dService.searchDevices(filter).pipe(first())
        .subscribe(
          (resp: ApiResponse) => {
            console.log('Filtered Merchant Response', resp);
            this.devices = resp.message;
            this.deviceCount = this.devices.length;
            this.inFilterMode = true;
            this.spinner.hide();
          },
          error => {
            this.spinner.hide();
          });
    }
  }

  clearSearchResult() {
    this.searchForm.reset();
    this.f.status.setValue("");
    this.f.model.setValue("");
    this.f.location.setValue("");
    this.inFilterMode = false;
    this.onPageLoad();
  }

  showProfile(id: number) {
    //this.router.navigate[]
  }

  ngOnDestroy(): void {
    this.mSub.remove;
  }

}
