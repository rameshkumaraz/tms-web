import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, first } from 'rxjs/operators';
import { ApiResponse } from '../../shared/model/api.response';
import { LocationService } from './../location.service';
import { Location } from '../../model/location';
import { AuthenticationService } from '../../utils/services';
import { Merchant } from '../../model/merchant';
import { MerchantService } from '../../merchant/merchant.service';
import { RolesEnum } from 'src/app/utils/guards/roles.enum';

@Component({
  selector: 'app-loation-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent implements OnInit {

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

  sub;

  merchant: Merchant;

  merchants: Array<Merchant>;

  isAdmin = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private locationService: LocationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private authService: AuthenticationService,
    private merchantService: MerchantService) { }

  ngOnInit(): void {
    this.sub = this.activatedroute.paramMap.subscribe(params => {
      console.log(params);
      this.actionType = params.get('actionType');
      this.locId = params.get('id');
    });

    console.log(this.authService.getCurrentUser());
    this.locationForm = this.formBuilder.group({
      merchant: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.max(200)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.max(500)]],
      desc: ['']
    });

    if (this.actionType == 'view') {
      this.locationForm.disable();
    }

    if (this.authService.getRole() == RolesEnum.AZ_ROOT_ADMIN ||
        this.authService.getRole() == RolesEnum.AZ_ADMIN ||
        this.authService.getRole() == RolesEnum.AZ_SUPPORT) {
      this.loadMerchants();
      this.isAdmin = true;
    } else {
      this.loadMerchant(this.authService.getCurrentUser().merchantId);
    }

    if (this.actionType != 'add') {
      this.loadLocation();
    }
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

  loadMerchants() {
    this.spinner.show();
    this.merchantService.getAllMerchants()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Merchant Response', resp);
          this.merchants = resp.message;
          if (!this.merchants) {
            this.toastr.error(this.errMsg);
          }
          this.spinner.hide();
        },
        err => {
          console.log('Unable to load merchants, please contact adminstrator', err);
          this.errMsg = err.message;
          this.toastr.error(this.errMsg);
          this.spinner.hide();
        });
  }

  loadMerchant(id: number) {
    this.spinner.show();
    this.merchantService.getMerchant(id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Merchant Response', resp);
          this.merchant = resp.message;
          if (!this.merchant) {
            this.toastr.error(this.errMsg);
          }
          this.spinner.hide();
        },
        err => {
          console.log('Unable to load merchants, please contact adminstrator', err);
          this.errMsg = err.message;
          this.toastr.error(this.errMsg);
          this.spinner.hide();
        });
  }

  loadLocation() {
    this.spinner.show();
    this.locationService.getLocation(this.locId)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Merchant Response', resp);
          this.location = resp.message;
          if (!this.location) {
            this.toastr.error(this.errMsg);
          } else {
            this.locationForm.setValue({
              name: this.location.name,
              address: this.location.address,
              desc: this.location.desc,
            });
          }
          this.spinner.hide();
        },
        err => {
          console.log('Unable to load locations, please contact adminstrator', err);
          this.errMsg = err.message;
          this.toastr.error(this.errMsg);
          this.spinner.hide();
        });
  }

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

    this.locationService.createLocation(this.location).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Location has been created successfully.", "Location");
      this.router.navigate(['/location']);
    },
      err => {
        console.log('Unable to create merchant, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error(this.errMsg, "Location");
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
        console.log('Unable to create merchant, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error(this.errMsg, "Location");
        this.spinner.hide();
      });
  }

  edit() {
    this.actionType = 'edit';
    this.locationForm.enable();
  }

  delete() {
    // this.actionType = 'edit';
  }

  cancel() {
    this.router.navigate(['/merchant']);
  }

}
