import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { ApiResponse } from '../shared/model/api.response';
import { LocationService } from './location.service';

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

  constructor(private locationService: LocationService,
    private spinner: NgxSpinnerService,
    private router: Router) { }

  ngOnInit(): void {
    this.pageHeader = 'Location';
    this.onLoad();
  }

  onLoad() {
    this.spinner.show();
    this.locationService.getAllLocations()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Location Response', resp);
          this.locations = resp.message;
          this.locationCount = this.locations.length;
          this.spinner.hide();
        },
        error => {
        });
  }

  createLocation() {
    this.router.navigate(['/locationForm', { actionType: 'add' }]);
  }

  viewLocation(id: number) {
    this.router.navigate(['/locationForm', { actionType: 'view', id }]);
  }

  editLocation(id: number) {
    this.router.navigate(['/locationForm', { actionType: 'edit', id }]);
  }

  deleteLocation(id: number) {

  }

}
