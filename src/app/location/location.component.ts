import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { Merchant } from '../model/merchant';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { LocationService } from './location.service';
import { ActionEnum } from '../shared/enum/action.enum';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  faBars = faBars;
  faPlus = faPlus;
  faEye = faEye;
  faEdit = faEdit;
  faArchive = faArchive;
  faTh = faTh;

  pageHeader: string;
  page = 1;
  pageSize = 10;

  locationCount = 0;
  locations: Array<any>;

  merchant: Merchant;

  constructor(private locationService: LocationService,
    private appService: AppService,
    private spinner: NgxSpinnerService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.pageHeader = 'Location';
    this.appService.userMerchant.subscribe(data => {
      // console.log('User Merchant.....', data.id+':'+Object.keys(data).length);
      if(Object.keys(data).length > 0) {
        this.merchant = data;
        this.onLoad();
      }
    });
    // this.onLoad();
  }

  onLoad() {
    this.spinner.show();
    this.locationService.getLocationsForMerchant(this.merchant.id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Location Response', resp);
          this.locations = resp.message;
          this.locationCount = this.locations.length;
          this.spinner.hide();
        },
        error => {
          console.log('Location Response', error);
        });
  }

  createLocation() {
    this.router.navigate(['/lf', { actionType: ActionEnum.add, id: this.merchant.id }],{skipLocationChange: true});
  }

  viewLocation(id: number) {
    this.router.navigate(['/lf', { actionType: ActionEnum.view, id: id}],{skipLocationChange: true});
  }

  editLocation(id: number) {
    this.router.navigate(['/lf', { actionType: ActionEnum.edit, id: id}],{skipLocationChange: true});
  }

  deleteLocation(id: number) {
    this.locationService.deleteLocation(id).subscribe(data => {
      console.log('Location delete success....', data);
    },
    err => {
      console.log('Location delete error....', err);
    });
  }

}
