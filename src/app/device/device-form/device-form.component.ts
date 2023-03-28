import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged } from 'rxjs/operators';
import { DeviceModelService } from 'src/app/device-model/device-model.service';
import { Device } from 'src/app/model/device';
import { BaseFormComponent } from 'src/app/shared/core/base-form.component';
import { ActionEnum } from 'src/app/shared/enum/action.enum';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { DeviceService } from '../device.service';

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss']
})
export class DeviceFormComponent extends BaseFormComponent {

  @Output() modalClosed = new EventEmitter();

  @Input() merchant;
  @Input() locations: Array<any>;
  // @Input() location;
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

  // constructor(private formBuilder: FormBuilder,
  //   private router: Router,
  //   private activatedroute: ActivatedRoute,
  //   private service: DeviceService,
  //   private appService: AppService,
  //   private locService: LocationService,
  //   private modelService: DeviceModelService,
  //   private spinner: NgxSpinnerService,
  //   private toastr: ToastrService) { }

    constructor(private formBuilder: FormBuilder,
      private service: DeviceService,
      private modelService: DeviceModelService,
      private spinner: NgxSpinnerService,
      private toastr: ToastrService) {
      super();
    }  

  ngOnInit(): void {

    this.loadActionAccess(this.componentEnum.device.toString());

    this.loadModels();

    this.deviceForm = this.formBuilder.group({
      location: ['', [Validators.required]],
      serial: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      model: ['', [Validators.required]]
    });

    if (this.actionType != ActionEnum.add) {
      this.onPageLoad();
    }

    if (this.actionType == ActionEnum.view) {
      this.deviceForm.disable();
      this.pageHeader = 'View Device';
    }
  }

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

  onPageLoad() {
    this.deviceForm.setValue({
      location: this.device.location.id,
      serial: this.device.serial,
      name: this.device.name,
      model: this.device.model.id,
    });
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
    this.device.merchant = this.merchant.id;
    this.device.model = +this.device.model;
    this.device.location = +this.device.location;

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
    //appToUpdate.location = this.location.id;
    Object.assign(this.device, appToUpdate);
    this.device.merchant = this.merchant.id;
    this.device.model = this.device.model.id;
    this.device.canEdit = !!this.device.canEdit;
    this.device.canView = !!this.device.canView;

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

  updateStatus(id: number, status: number): void {
    this.spinner.show();
    let model = Object.assign({}, this.device);
    model.status = status;  
    this.service.updateStatus(id, model).subscribe(data => {
      this.close(true);
      console.log('Device status has been updated successfully');
      this.toastr.success('Device status has been updated successfully', 'Device');
    },
      err => {
        console.log('Unable to update device status....', err);
        this.toastr.error('Unable to update device status, please contact adminstrator', 'Device');
        this.spinner.hide();
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
    this.modalClosed.emit({ reload: reload });
  }

}
