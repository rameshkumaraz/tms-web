import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged } from 'rxjs/operators';
import { DeviceBrandService } from 'src/app/device-brand/device-brand.service';
import { DeviceModel } from 'src/app/model/device-model';
import { BaseFormComponent } from 'src/app/shared/core/base-form.component';
import { ActionEnum } from 'src/app/shared/enum/action.enum';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { DeviceModelService } from '../device-model.service';

@Component({
  selector: 'app-device-model-form',
  templateUrl: './device-model-form.component.html',
  styleUrls: ['./device-model-form.component.scss']
})
export class DeviceModelFormComponent extends BaseFormComponent {

  @Output() modalClosed = new EventEmitter();

  @Input() actionType;
  @Input() model: any;

  pageHeader = 'New Device Model';
  page = 1;
  pageSize = 10;

  modelForm: FormGroup;
  formSubmitted = false;
  isFailed = false;

  filePath;

  brands: Array<any>;

  namePattern = /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/;

  sub;

  constructor(private formBuilder: FormBuilder,
    private brandService: DeviceBrandService,
    private service: DeviceModelService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {

    this.loadActionAccess(this.componentEnum.deviceModel.toString());

    this.modelForm = this.formBuilder.group({
      brand: ['', [Validators.required, Validators.minLength(1)]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.max(200), Validators.pattern(this.namePattern)]],
      modelVersion: ['', [Validators.required, Validators.minLength(1), Validators.max(10)]],
      baseVersion: ['', [Validators.required, Validators.minLength(1), Validators.max(10)]],
      modelImage: [''],
      modelImageName: ['', Validators.required],
      desc: ['']
    });

    this.loadBrands();
    if (this.actionType != ActionEnum.add) {
      this.onPageLoad();
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
        if (val.length > 0 && val.length < 5) {
          this.f.desc.setValidators([Validators.minLength(5)]);
          this.f.desc.setValidators([Validators.minLength(200)]);
        } else {
          this.f.desc.clearValidators();
        }
        this.f.desc.updateValueAndValidity();
      });
  };

  onPageLoad() {
    this.modelForm.setValue({
      brand: this.model.brand.id,
      name: this.model.name,
      modelImage: this.model.modelImageName,
      modelVersion: this.model.modelVersion,
      baseVersion: this.model.baseVersion,
      modelImageName: this.model.modelImageName,
      desc: this.model.desc,
    });   

    this.filePath = this.getDeviceImagePath(this.f.modelImage.value);
  }

  loadBrands() {
    this.spinner.show();
    this.brandService.getAll().subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.brands = resp.message;
    },
      err => {
        console.log('Unable to load brand, please contact adminstrator', err);
        this.toastr.error('Unable to load brand, please contact adminstrator', "Device Model");
        this.spinner.hide();
      });
  }

  get f() { return this.modelForm['controls'] }

  onFileChange(event) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.modelForm.patchValue({
        modelImage: file,
        modelImageName: file.name
      });

      const reader = new FileReader();
      reader.onload = e => this.filePath = reader.result;

      reader.readAsDataURL(file);
    }
    // console.log("File name", this.f.bundleName.value);
  }

  save() {
    console.log('nextTab');
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.modelForm.invalid) {
      console.log('From invalid', this.modelForm);
      return;
    }
    this.spinner.show();

    const formData = this.getFormData();

    formData.forEach(f => {
      console.log('Form Data....', f);
    });

    // this.model = <DeviceModel>this.modelForm.value;

    this.service.createModel(formData).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Model has been created successfully.", "Device Model");
      this.close(true);
    },
      err => {
        console.log('Unable to create model, please contact adminstrator', err);
        this.toastr.error('Unable to create model, please contact adminstrator', "Device Model");
        this.spinner.hide();
      });
  }

  getFormData(): FormData {
    const formData = new FormData();
    formData.append('modelImage', this.modelForm.get('modelImage').value);
    formData.append('name', this.modelForm.get('name').value);
    formData.append('brand', this.modelForm.get('brand').value);
    formData.append('modelVersion', this.modelForm.get('modelVersion').value);
    formData.append('baseVersion', this.modelForm.get('baseVersion').value);
    formData.append('modelImageName', this.modelForm.get('modelImageName').value);
    formData.append('desc', this.modelForm.get('desc').value);

    console.log('Form data....', formData.get('modelImageName'));
    return formData;
  }

  update() {
    this.formSubmitted = true;

    console.log(this.modelForm);

    // stop here if form is invalid
    if (this.modelForm.invalid) {
      console.log('From invalid', this.modelForm);
      return;
    }
    this.spinner.show();

    const formData = this.getFormData();
    // formData.append('canEdit', this.model.canEdit+'');
    // formData.append('canView', this.model.canEdit+'');
    formData.append('id', this.model.id+'');

    formData.forEach((f, k) => {
      console.log('Form Data....', k+': '+f);
    });

    // let brandToUpdate = <DeviceModel>this.modelForm.value;
    // Object.assign(this.model, brandToUpdate);

    // this.model.canEdit = !!this.model.canEdit;
    // this.model.canView = !!this.model.canEdit;

    this.service.updateModel(formData).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Model has been updated successfully.", "Device Model");
      this.close(true);
    },
      err => {
        console.log('Unable to update model, please contact adminstrator', err);
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

  updateStatus(id: number, status: number): void {
    this.spinner.show();
    let dmodel = Object.assign({}, this.model);
    dmodel.status = status;  
    this.service.updateStatus(id, dmodel).subscribe(data => {
      this.close(true);
      console.log('Model status has been updated successfully');
      this.toastr.success('Model status has been updated successfully', 'Device Model');
    },
      err => {
        console.log('Unable to update model status....', err);
        this.toastr.error('Unable to update model status, please contact adminstrator', 'Device Model');
        this.spinner.hide();
      });
  }
}
