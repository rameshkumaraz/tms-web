import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, first } from 'rxjs/operators';
import { ApiResponse } from '../../shared/model/api.response';
import { LocationService } from './../location.service';
import { Location } from '../../model/location';
import { ActionEnum } from 'src/app/shared/enum/action.enum';
import { BaseFormComponent } from 'src/app/shared/core/base-form.component';

@Component({
  selector: 'app-loation-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent extends BaseFormComponent {

  @Input() merchant;
  @Input() location;
  @Input() actionType;

  pageHeader = 'New Location';
  page = 1;
  pageSize = 10;

  locationForm: FormGroup;
  formSubmitted = false;
  isFailed = false;
  errMsg: string;

  constructor(private formBuilder: FormBuilder,
    private locationService: LocationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {

    this.loadActionAccess(this.componentEnum.merchant.toString());

    this.locationForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.max(200)]],
      address: ['', [Validators.required, Validators.minLength(25), Validators.max(500)]],
      desc: ['']
    });

    if (this.actionType != ActionEnum.add) {
      this.onPageLoad();
    }

    if (this.actionType == ActionEnum.view) {
      this.locationForm.disable();
      this.pageHeader = 'View Location';
    }

    if (this.actionType == ActionEnum.edit) {
      this.locationForm['controls'].name.disable();
      this.pageHeader = 'Update Location';
    }

    // this.sub = this.locationService.location.subscribe(data => {
    //   console.log('Location to populate...', data);
    //   if (!data.name) { }
    //   else {
    //     this.location = data;
    //     // console.log('Location to populate...', this.location);
    //     this.locationForm.setValue({
    //       name: this.location.name,
    //       address: this.location.address,
    //       desc: this.location.desc,
    //     });
    //     if (this.actionType == 'view') {
    //       this.locationForm.disable();
    //     }
    //   }
    // });
  }

  onPageLoad() {
    this.locationForm.setValue({
      name: this.location.name,
      address: this.location.address,
      desc: this.location.desc,
    });
  }

  get f() { return this.locationForm['controls'] }

  setDescValidator() {
    this.f.desc.valueChanges.
      pipe(distinctUntilChanged()).
      subscribe(val => {
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
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.locationForm.invalid) {
      console.log('From invalid', this.locationForm);
      return;
    }
    this.spinner.show();
    this.location = <Location>this.locationForm.value;
    this.location.merchant = this.merchant.id;

    this.locationService.create(this.location).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Location has been created successfully.", "Location");
      this.close(true);
    },
      err => {
        console.log('Unable to create location, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to create location, please contact adminstrator', "Location");
        this.spinner.hide();
      });
  }

  update() {
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.locationForm.invalid) {
      console.log('From invalid', this.locationForm);
      return;
    }
    this.spinner.show();
    let locationToUpdate = <Location>this.locationForm.value;
    Object.assign(this.location, locationToUpdate);
    this.location.canEdit = !!this.location.canEdit;
    this.location.canView = !!this.location.canEdit;

    this.locationService.update(this.location).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Location has been updated successfully.", "Location");
      this.close(true);
    },
      err => {
        console.log('Unable to update location, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to update location, please contact adminstrator', "Location");
        this.spinner.hide();
      });
  }

  edit() {
    this.actionType = ActionEnum.edit;
    this.pageHeader = 'Update Location';
    this.locationForm.enable();
    this.f.name.disable();
  }

  delete() {
    this.locationService.delete(this.location.id).subscribe(data => {
      this.close(true);
      this.toastr.success('Location has been deleted successfully.', 'Location');
    },
      err => {
        console.log('Unable to delete location, please contact administrator.', 'Location');
        this.toastr.error('Unable to delete location, please contact administrator.');
      });
  }

  updateStatus(id: number, status: number): void {
    this.spinner.show();
    let model = Object.assign({}, this.location);
    model.status = status;  
    this.locationService.updateStatus(id, model).subscribe(data => {
      this.close(true);
      console.log('Location status has been updated successfully');
      this.toastr.success('Location status has been updated successfully', 'Location');
    },
      err => {
        console.log('Unable to update location status....', err);
        this.toastr.error('Unable to update locationn status, please contact adminstrator', 'Location');
        this.spinner.hide();
      });
  }
}
