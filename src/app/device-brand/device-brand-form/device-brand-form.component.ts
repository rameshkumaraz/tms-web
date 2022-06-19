import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged } from 'rxjs/operators';
import { DeviceBrand } from 'src/app/model/device-brand';
import { BaseFormComponent } from 'src/app/shared/core/base-form.component';
import { ActionEnum } from 'src/app/shared/enum/action.enum';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { DeviceBrandService } from '../device-brand.service';

@Component({
  selector: 'app-device-brand-form',
  templateUrl: './device-brand-form.component.html',
  styleUrls: ['./device-brand-form.component.scss']
})
export class DeviceBrandFormComponent extends BaseFormComponent {

  @Input() brand: any;
  @Input() actionType;

  brandId;

  pageHeader = 'New Brand';
  page = 1;
  pageSize = 10;

  brandForm: FormGroup;
  formSubmitted = false;
  isFailed = false;

  sub;

  constructor(private formBuilder: FormBuilder,
    private service: DeviceBrandService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {

    this.loadActionAccess(this.componentEnum.deviceBrand.toString());

    this.brandForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.max(200)]],
      desc: ['']
    });

    if (this.actionType != ActionEnum.add) {
      this.onPageLoad();
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

  onPageLoad() {

    this.brandForm.setValue({
      name: this.brand.name,
      desc: this.brand.desc,
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
      this.onPageLoad();
      this.spinner.hide();
      this.toastr.success("Brand has been created successfully.", "Location");
      this.close(true);
    },
      err => {
        console.log('Unable to create brand, please contact adminstrator', err);
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

    this.brand.canEdit = !!this.brand.canEdit;
    this.brand.canView = !!this.brand.canEdit;

    this.service.update(this.brand).subscribe((resp: ApiResponse) => {
      this.onPageLoad();
      this.spinner.hide();
      this.toastr.success("Brand has been updated successfully.", "Location");
      this.close(true);
    },
      err => {
        console.log('Unable to update brand, please contact adminstrator', err);
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
      this.close(true);
    },
      err => {
        console.log('Unable to delete brand, please contact administrator.', 'Device Brand');
        this.toastr.error('Unable to delete brand, please contact administrator.', 'Device Brand');
      });
  }

  updateStatus(id: number, status: number): void {
    this.spinner.show();
    let model = Object.assign({}, this.brand);
    model.status = status;  
    this.service.updateStatus(id, model).subscribe(data => {
      this.close(true);
      console.log('Brand status has been updated successfully');
      this.toastr.success('Brand status has been updated successfully', 'Device Brand');
    },
      err => {
        console.log('Unable to update brand status....', err);
        this.toastr.error('Unable to update brand status, please contact adminstrator', 'Device Brand');
        this.spinner.hide();
      });
  }
}
