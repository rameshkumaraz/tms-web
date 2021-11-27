import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, first } from 'rxjs/operators';
import { ApiResponse } from '../../shared/model/api.response';
import { LocationService } from './../location.service';
import { Location } from '../../model/location';
import { Merchant } from '../../model/merchant';
import { MerchantService } from '../../merchant/merchant.service';
import { AuthenticationService } from 'src/app/utils/services';
import { AppService } from 'src/app/shared/service/app.service';
import { Subscription } from 'rxjs';
import { ActionEnum } from 'src/app/shared/enum/action.enum';

@Component({
  selector: 'app-loation-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent implements OnInit, OnDestroy {

  actionType;
  locId;

  pageHeader = 'New Location';
  page = 1;
  pageSize = 10;

  locationForm: FormGroup;
  formSubmitted = false;
  isFailed = false;
  errMsg: string;

  location: Location;

  sub: Subscription;

  merchant: Merchant;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private appService: AppService,
    private activatedroute: ActivatedRoute,
    private locationService: LocationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.sub = this.activatedroute.paramMap.subscribe(params => {
      console.log(params);
      this.actionType = params.get('actionType');
      this.locId = params.get('id');
    });

    // console.log(this.authService.getCurrentUser());
    this.locationForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.max(200)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.max(500)]],
      desc: ['']
    });

    if (this.actionType != ActionEnum.add) {
      this.onLoad();
    } else {
      this.spinner.show();
      this.appService.userMerchant.subscribe(data => {
        this.merchant = data;
        this.spinner.hide();
      });
    }


    if (this.actionType == ActionEnum.view) {
      this.locationForm.disable();
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

  onLoad() {
    this.spinner.show();
    this.locationService.getLocation(this.locId).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.location = resp.message;
      this.locationForm.setValue({
        name: this.location.name,
        address: this.location.address,
        desc: this.location.desc,
      });
    },
      err => {
        console.log('Unable to load location, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error(this.errMsg, "Location");
        this.spinner.hide();
      });
  }

  get f() { return this.locationForm['controls'] }

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
    if (this.locationForm.invalid) {
      console.log('From invalid', this.locationForm);
      return;
    }
    this.spinner.show();
    this.location = <Location>this.locationForm.value;
    this.location.merchant = this.merchant.id;

    this.locationService.createLocation(this.location).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Location has been created successfully.", "Location");
      this.router.navigate(['/location']);
    },
      err => {
        console.log('Unable to create merchant, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to create merchant, please contact adminstrator', "Location");
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

    this.locationService.updateLocation(this.location).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Location has been updated successfully.", "Location");
      this.router.navigate(['/location']);
    },
      err => {
        console.log('Unable to update merchant, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to update merchant, please contact adminstrator', "Location");
        this.spinner.hide();
      });
  }

  edit() {
    this.actionType = ActionEnum.edit;
    this.locationForm.enable();
  }

  delete() {
    this.locationService.deleteLocation(this.location.id);
    this.locationService.deleteLocation(this.location.id).subscribe(data => {
      this.router.navigate(['/location']);
    },
    err => {
      console.log('Unable to delete location, please contact administrator.', 'Location');
      this.toastr.error('Unable to delete location, please contact administrator.');
    });
  }

  cancel() {
    this.router.navigate(['/location']);
  }


  public get actionEnum(): typeof ActionEnum {
    return ActionEnum; 
  }


  ngOnDestroy(): void {
    this.sub.remove;
  }
}