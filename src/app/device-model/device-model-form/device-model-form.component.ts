import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged } from 'rxjs/operators';
import { DeviceBrandService } from 'src/app/device-brand/device-brand.service';
import { DeviceModel } from 'src/app/model/device-model';
import { ActionEnum } from 'src/app/shared/enum/action.enum';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { DeviceModelService } from '../device-model.service';

@Component({
  selector: 'app-device-model-form',
  templateUrl: './device-model-form.component.html',
  styleUrls: ['./device-model-form.component.scss']
})
export class DeviceModelFormComponent implements OnInit {

  @Output() modelClosed = new EventEmitter();

  @Input() actionType;
  @Input() model: any;

  pageHeader = 'New Device Model';
  page = 1;
  pageSize = 10;

  modelForm: FormGroup;
  formSubmitted = false;
  isFailed = false;

  brands: Array<any>;

  sub;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private brandService: DeviceBrandService,
    private service: DeviceModelService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    // this.sub = this.activatedroute.paramMap.subscribe(params => {
    //   console.log(params);
    //   this.actionType = params.get('actionType');
    //   this.modelId = params.get('id');
    // });

    // console.log(this.authService.getCurrentUser());
    this.modelForm = this.formBuilder.group({
      brand: ['', [Validators.required, Validators.minLength(1)]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.max(200)]],
      modelVersion: ['', [Validators.required, Validators.minLength(1), Validators.max(10)]],
      baseVersion: ['', [Validators.required, Validators.minLength(1), Validators.max(10)]],
      desc: ['']
    });

    // console.log("Selected model....", this.model);

    this.loadBrands();
    if (this.actionType != ActionEnum.add) {
      this.onLoad();
    }

    if (this.actionType == ActionEnum.view) {
      this.modelForm.disable();
      this.pageHeader = 'View Model';
    }

    if (this.actionType == ActionEnum.edit) {
      this.pageHeader = 'Update Model';
      this.modelForm['controls'].name.disable();
      this.modelForm['controls'].brand.disable();
    }

    this.setDescValidator();
  }

  setDescValidator() {
    this.f.desc.valueChanges.
      pipe(distinctUntilChanged()).
      subscribe(val => {
        // console.log('desc value', val + ':' + val.length);
        if (val.length > 0 && val.length < 5) {
          this.f.desc.setValidators([Validators.minLength(5)]);
          this.f.desc.setValidators([Validators.minLength(200)]);
        } else {
          this.f.desc.clearValidators();
        }
        this.f.desc.updateValueAndValidity();
      });
  };

  onLoad() {
    this.modelForm.setValue({
      brand: this.model.brand.id,
      name: this.model.name,
      modelVersion: this.model.modelVersion,
      baseVersion: this.model.baseVersion,
      desc: this.model.desc,
    });
  }

  // onLoad() {
  //   this.spinner.show();
  //   this.service.getById(this.modelId).subscribe((resp: ApiResponse) => {
  //     this.spinner.hide();
  //     this.model = resp.message;
  //     console.log("Model...", this.model);
  //     this.modelForm.setValue({
  //       brand: this.model.brand.id,
  //       name: this.model.name,
  //       modelVersion: this.model.modelVersion,
  //       baseVersion: this.model.baseVersion,
  //       desc: this.model.desc,
  //     });
  //   },
  //     err => {
  //       console.log('Unable to load brand, please contact adminstrator', err);
  //       this.errMsg = err.message;
  //       this.toastr.error(this.errMsg, "Location");
  //       this.spinner.hide();
  //     });
  // }

  loadBrands() {
    this.spinner.show();
    this.brandService.getAll().subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.brands = resp.message;
    },
      err => {
        console.log('Unable to load brand, please contact adminstrator', err);
        // this.errMsg = err.message;
        this.toastr.error('Unable to load brand, please contact adminstrator', "Device Model");
        this.spinner.hide();
      });
  }

  get f() { return this.modelForm['controls'] }

  save() {
    console.log('nextTab');
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.modelForm.invalid) {
      console.log('From invalid', this.modelForm);
      return;
    }
    this.spinner.show();
    this.model = <DeviceModel>this.modelForm.value;

    this.service.create(this.model).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Model has been created successfully.", "Device Model");
      this.close(true);
    },
      err => {
        console.log('Unable to create model, please contact adminstrator', err);
        // this.errMsg = err.message;
        this.toastr.error('Unable to create model, please contact adminstrator', "Device Model");
        this.spinner.hide();
      });
  }

  update() {
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.modelForm.invalid) {
      console.log('From invalid', this.modelForm);
      return;
    }
    this.spinner.show();
    let brandToUpdate = <DeviceModel>this.modelForm.value;
    Object.assign(this.model, brandToUpdate);

    this.service.update(this.model).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Model has been updated successfully.", "Device Model");
      // this.router.navigate(['/dmodel']);
      this.close(true);
    },
      err => {
        console.log('Unable to update model, please contact adminstrator', err);
        // this.errMsg = err.message;
        this.toastr.error('Unable to update model, please contact adminstrator', "Device Model");
        this.spinner.hide();
      });
  }

  edit() {
    this.actionType = ActionEnum.edit;
    this.modelForm.enable();
    this.pageHeader = 'Update Model';
    this.f.name.disable();
    this.f.brand.disable();
  }

  delete() {
    this.service.delete(this.model.id).subscribe(data => {
      this.toastr.success('Model has been deleted successfully', 'Device Brand')
      // this.router.navigate(['/dmodel']);
      this.close(true);
    },
      err => {
        console.log('Unable to delete model, please contact administrator.');
        this.toastr.error('Unable to delete model, please contact administrator.', 'Device Model');
      });
  }

  close(reload: boolean) {
    console.log('close invoked');
    this.modelClosed.emit({reload: reload});
  }

  public get actionEnum(): typeof ActionEnum {
    return ActionEnum;
  }

}
