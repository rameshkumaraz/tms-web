import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged } from 'rxjs/operators';
import { DeviceBrand } from 'src/app/model/device-brand';
import { ActionEnum } from 'src/app/shared/enum/action.enum';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { AppService } from 'src/app/shared/service/app.service';
import { DeviceBrandService } from '../device-brand.service';

@Component({
  selector: 'app-device-brand-form',
  templateUrl: './device-brand-form.component.html',
  styleUrls: ['./device-brand-form.component.scss']
})
export class DeviceBrandFormComponent implements OnInit {

  actionType;
  brandId;

  pageHeader = 'New Brand';
  page = 1;
  pageSize = 10;

  brandForm: FormGroup;
  formSubmitted = false;
  isFailed = false;
  errMsg: string;

  brand: DeviceBrand;

  sub;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private service: DeviceBrandService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.sub = this.activatedroute.paramMap.subscribe(params => {
      console.log(params);
      this.actionType = params.get('actionType');
      this.brandId = params.get('id');
    });

    // console.log(this.authService.getCurrentUser());
    this.brandForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.max(200)]],
      desc: ['']
    });

    if (this.actionType != ActionEnum.add) {
      this.onLoad();
    }

    if (this.actionType == ActionEnum.view) {
      this.brandForm.disable();
      this.pageHeader = 'View Brand';
    }

    if (this.actionType == ActionEnum.edit) {
      this.pageHeader = 'Update Brand';
      this.brandForm['controls'].name.disable();
    }
  }

  onLoad() {
    this.spinner.show();
    this.service.getById(this.brandId).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.brand = resp.message;
      this.brandForm.setValue({
        name: this.brand.name,
        desc: this.brand.desc,
      });
    },
      err => {
        console.log('Unable to load brand, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error(this.errMsg, "Location");
        this.spinner.hide();
      });
  }

  get f() { return this.brandForm['controls'] }

  setDescValidator() {
    this.f.desc.valueChanges.
      pipe(distinctUntilChanged()).
      subscribe(val => {
        console.log('desc value', val + ':' + val.length);
        if (val.length > 0 && val.length < 6) {
          this.f.desc.setValidators([Validators.minLength(6)]);
          this.f.desc.setValidators([Validators.minLength(200)]);
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
    if (this.brandForm.invalid) {
      console.log('From invalid', this.brandForm);
      return;
    }
    this.spinner.show();
    this.brand = <DeviceBrand>this.brandForm.value;

    this.service.create(this.brand).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Brand has been created successfully.", "Location");
      this.router.navigate(['/dbrand']);
    },
      err => {
        console.log('Unable to create brand, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to create brand, please contact adminstrator', "Location");
        this.spinner.hide();
      });
  }

  update() {
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.brandForm.invalid) {
      console.log('From invalid', this.brandForm);
      return;
    }
    this.spinner.show();
    let brandToUpdate = <DeviceBrand>this.brandForm.value;
    Object.assign(this.brand, brandToUpdate);

    this.service.update(this.brand).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Brand has been updated successfully.", "Location");
      this.router.navigate(['/dbrand']);
    },
      err => {
        console.log('Unable to update brand, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to update brand, please contact adminstrator', "Location");
        this.spinner.hide();
      });
  }

  edit() {
    this.actionType = ActionEnum.edit;
    this.brandForm.enable();
    this.pageHeader = 'Update Brand';
    this.f.name.disable();
  }

  delete() {
    this.service.delete(this.brand.id).subscribe(data => {
      this.toastr.success('Brand has been deleted successfully', 'Device Brand')
      this.router.navigate(['/dbrand']);
    },
    err => {
      console.log('Unable to delete brand, please contact administrator.', 'Device Brand');
      this.toastr.error('Unable to delete brand, please contact administrator.', 'Device Brand');
    });
  }

  cancel() {
    this.router.navigate(['/dbrand']);
  }


  public get actionEnum(): typeof ActionEnum {
    return ActionEnum; 
  }
}
