import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged } from 'rxjs/operators';
import { DeviceModelService } from 'src/app/device-model/device-model.service';
import { LocationService } from 'src/app/location/location.service';
import { Device } from 'src/app/model/device';
import { Merchant } from 'src/app/model/merchant';
import { ActionEnum } from 'src/app/shared/enum/action.enum';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { AppService } from 'src/app/shared/service/app.service';
import { DeviceService } from '../device.service';

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss']
})
export class DeviceFormComponent implements OnInit {

  @Output() modelClosed = new EventEmitter();

  // @Input() merchant;
  // @Input() locations: Array<any>;
  @Input() location;
  @Input() device;
  @Input() actionType;

  pageHeader = 'New Device';
  page = 1;
  pageSize = 10;

  deviceForm: FormGroup;
  formSubmitted = false;
  isFailed = false;
  errMsg: string;

  // locations: Array<any>;
  models: Array<any>;

  // device: any;

  // loc: any;

  // merchant: Merchant;

  sub;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private service: DeviceService,
    private appService: AppService,
    private locService: LocationService,
    private modelService: DeviceModelService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    // this.sub = this.activatedroute.paramMap.subscribe(params => {
    //   console.log(params);
    //   this.actionType = params.get('actionType');
    //   this.deviceId = params.get('id');
    //   this.locId = params.get('locId');
    // });

    // this.appService.userMerchant.subscribe(data => {
    //   this.merchant = data;
    //   this.loadLocations();
    //   this.loadModels();
    // });

    this.loadModels();

    // console.log(this.authService.getCurrentUser());
    this.deviceForm = this.formBuilder.group({
      location: ['', [Validators.required]],
      serial: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      model: ['', [Validators.required]]
    });

    if (this.actionType != ActionEnum.add) {
      this.onLoad();
    }

    if (this.actionType == ActionEnum.view) {
      this.deviceForm.disable();
      this.pageHeader = 'View Device';
    }

    // if (this.actionType == ActionEnum.edit) {
    //   this.deviceForm['controls'].serial.disable();
    //   this.deviceForm['controls'].model.disable();
    // }
    // this.deviceForm['controls'].location.disable();
    this.deviceForm['controls'].location.setValue(this.location.id+"");
  }

  // loadLocations() {
  //   this.spinner.show();
  //   this.locService.getLocationsForMerchant(this.merchant.id).subscribe((resp: ApiResponse) => {
  //     this.spinner.hide();
  //     this.locations = resp.message;
  //   },
  //     err => {
  //       console.log('Unable to load locations, please contact adminstrator', err);
  //       this.errMsg = err.message;
  //       this.toastr.error('Unable to load locations, please contact adminstrator', "Device");
  //       this.spinner.hide();
  //     });
  // }

  loadModels() {
    this.spinner.show();
    this.modelService.getAll().subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.models = resp.message;
    },
      err => {
        console.log('Unable to load device models, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to load device models, please contact adminstrator', "Device");
        this.spinner.hide();
      });
  }

  onLoad() {
    // this.spinner.show();
    // this.service.get(this.deviceId).subscribe((resp: ApiResponse) => {
    //   this.spinner.hide();
    //   this.device = resp.message;
      this.deviceForm.setValue({
        location: this.device.location.id,
        serial: this.device.serial,
        name: this.device.name,
        model: this.device.model.id,
      });
      // this.locId = this.device.location.id;
    // },
    //   err => {
    //     console.log('Unable to load application, please contact adminstrator', err);
    //     this.errMsg = err.message;
    //     this.toastr.error(this.errMsg, "Application");
    //     this.spinner.hide();
    //   });
  }

  get f() { return this.deviceForm['controls'] }

  setDescValidator() {
    this.f.desc.valueChanges.
      pipe(distinctUntilChanged()).
      subscribe(val => {
        if (val.length > 0 && val.length < 6) {
          this.f.desc.setValidators([Validators.minLength(5)]);
          this.f.desc.setValidators([Validators.minLength(250)]);
        } else {
          this.f.desc.clearValidators();
        }
        this.f.desc.updateValueAndValidity();
      });
  };

  save() {
    console.log('nextTab');
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.deviceForm.invalid) {
      console.log('From invalid', this.deviceForm);
      return;
    }
    this.spinner.show();
    this.device = <Device>this.deviceForm.value;
    // this.device.location = this.location.id;
    // this.app.merchant = this.merchant.id;

    console.log("Device value...", this.device);

    this.service.create(this.device).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Device has been created successfully.", "Device");
      this.close(true);
    },
      err => {
        console.log('Unable to create device, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to create device, please contact adminstrator', "Device");
        this.spinner.hide();
      });
  }

  update() {
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.deviceForm.invalid) {
      console.log('From invalid', this.deviceForm);
      return;
    }
    this.spinner.show();
    let appToUpdate = <Device>this.deviceForm.value;
    // appToUpdate.location = this.location.id;
    Object.assign(this.device, appToUpdate);

    this.service.update(this.device).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Deivce has been updated successfully.", "Device");
      this.close(true);
    },
      err => {
        console.log('Unable to update device, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to update device, please contact adminstrator', "Device");
        this.spinner.hide();
      });
  }

  edit() {
    this.actionType = ActionEnum.edit;
    this.deviceForm.enable();
    this.f.serial.disable();
    this.f.model.disable();
  }

  delete() {
    this.service.delete(this.device.id).subscribe(data => {
      this.toastr.success('Device has been deleted successfully', 'Device')
      this.close(true);
    },
    err => {
      console.log('Unable to delete device, please contact administrator.', 'Device');
      this.toastr.error('Unable to delete device, please contact administrator.', 'Device');
    });
  }

  cancel() {
    this.close(false);
  }


  public get actionEnum(): typeof ActionEnum {
    return ActionEnum; 
  }

  close(reload: boolean) {
    console.log('close invoked');
    this.modelClosed.emit({reload: reload});
  }

}
