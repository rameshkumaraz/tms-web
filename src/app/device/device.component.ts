import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, first } from 'rxjs/operators';
import { LocationService } from '../location/location.service';
import { Merchant } from '../model/merchant';
import { Location } from '../model/location';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { DeviceService } from './device.service';
import { ActionEnum } from '../shared/enum/action.enum';
import { ToastrService } from 'ngx-toastr';
import { Device } from '../model/device';
import { BaseComponent } from '../shared/core/base.component';
import { FormBuilder } from '@angular/forms';
import { DeviceModelService } from '../device-model/device-model.service';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent extends BaseComponent {

  @ViewChild("dvscName") dvscName: ElementRef;
  @ViewChild("dvscSerial") dvscSerial: ElementRef;

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

  debounceTime = 750;

  closeResult: string;

  constructor(private appService: AppService,
    private dService: DeviceService,
    private locationService: LocationService,
    private dmService: DeviceModelService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {

    super.ngOnInit();

    this.pageHeader = 'Devices';

    this.loadActionAccess(this.componentEnum.device.toString());

    // this.sub = this.activatedroute.paramMap.subscribe(params => {
    //   console.log(params);
    //   this.locId = params.get('locId');
    // });

    console.log('status keys', this.statusKeys);

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
      status: ['']
    });

    this.adSearchForm = this.formBuilder.group({
      name: [''],
      serial: [''],
      model: [''],
      location: [''],
      status: ['']
    });
  }

  ngAfterViewInit(): void {
    fromEvent(this.dvscName.nativeElement, 'keyup').pipe(debounceTime(this.debounceTime)).subscribe(data => {
      this.searchDevices('name');
    });

    fromEvent(this.dvscSerial.nativeElement, 'keyup').pipe(debounceTime(this.debounceTime)).subscribe(data => {
      this.searchDevices('serial');
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
          else
            this.spinner.hide();
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

  updateStatus(id: number, status: number) {
    this.spinner.show();
    let model = Object.assign({}, this.filterDevice(id));
    model.status = status;
    this.dService.updateStatus(id, model).subscribe(data => {
      console.log('Device status has been updated successfully');
      this.toastr.success('Device status has been updated successfully', 'Device');
      this.onPageLoad();
      this.spinner.hide();
    },
      err => {
        console.log('Unable to update device status....', err);
        this.toastr.error('Unable to update device status, please contact adminstrator', 'Device');
        this.spinner.hide();
      });
  }

  get f() { return this.searchForm['controls'] }
  get af() { return this.adSearchForm['controls'] }

  searchDevices(type: string) {

    console.log('Target Id....', type);
    if(type == 'name' && this.f.name.value.length < 3) {
      return;
    }
    if(type == 'serial' && this.f.serial.value.length < 3) {
      return;
    }
    this.spinner.show();
    if(type == 'name') {
      this.f.serial.setValue('');
      this.f.status.setValue('');
    } else if (type == 'serial'){
      this.f.name.setValue('');
      this.f.status.setValue('');
    } else if (type == 'status'){
      this.f.name.setValue('');
      this.f.serial.setValue('');
    }

    let filter = this.searchForm.value;
    filter.merchant = this.merchant.id;
    if (this.f.name.value || this.f.serial.value || this.f.status.value) {
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

  // searchDevices() {
  //   console.log('Filter', this.searchForm.value);
  //   let filter = this.searchForm.value;
  //   filter.merchant = this.merchant.id;
  //   console.log('Filter', filter);
  //   if (this.f.name.value || this.f.serial.value || this.f.model.value || this.f.location.value || this.f.status.value) {
  //     this.spinner.show();
  //     this.dService.searchDevices(filter).pipe(first())
  //       .subscribe(
  //         (resp: ApiResponse) => {
  //           console.log('Filtered Merchant Response', resp);
  //           this.devices = resp.message;
  //           this.deviceCount = this.devices.length;
  //           this.inFilterMode = true;
  //           this.spinner.hide();
  //         },
  //         error => {
  //           this.spinner.hide();
  //         });
  //   }
  // }

  clearSearchResult() {
    this.searchForm.reset();
    this.f.status.setValue("");
    this.inFilterMode = false;
    this.onPageLoad();
  }

  openAdSearch(content: any){
    this.adSearchForm.reset();
    this.adSearchForm.controls['model'].setValue('');
    this.adSearchForm.controls['location'].setValue('');
    this.adSearchForm.controls['status'].setValue('');
    this.openModal(content, 'sm', 'Advanced Search');
  }

  closeAdSearch(){
    this.closeModal(false);
  }

  advancedSearch(){
    console.log(this.adSearchForm.value);
    if (this.af.serial.value || this.af.name.value || this.af.model.value || this.af.location.value || this.af.status.value) {
      this.spinner.show();
      let formValue = this.adSearchForm.value;
      formValue.merchant = this.merchant.id;
      this.dService.searchDevices(formValue).pipe(first())
        .subscribe(
          (resp: ApiResponse) => {
            console.log('Filtered Merchant Response', resp);
            this.devices = resp.message;
            this.deviceCount = this.devices.length;
            this.inFilterMode = true;
            this.spinner.hide();
            this.closeModal(false);
          },
          error => {
            this.spinner.hide();
          });
    } 
  }

  showProfile(id: number) {
    //this.router.navigate[]
  }

  ngOnDestroy(): void {
    this.mSub.remove;
  }

}
