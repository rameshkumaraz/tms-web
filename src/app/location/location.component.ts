import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { Merchant } from '../model/merchant';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { LocationService } from './location.service';
import { ActionEnum } from '../shared/enum/action.enum';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../shared/core/base.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent extends BaseComponent {

  pageHeader: string;
  page = 1;
  pageSize = 10;

  locationCount = 0;
  locations: Array<any>;

  location: any
  
  merchant: Merchant;

  actionType;

  mSub;

  constructor(private locationService: LocationService,
    private appService: AppService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
      super();
  }

  ngOnInit(): void {
    this.pageHeader = 'Location';

    this.inFilterMode = false;

    this.mSub = this.appService.userMerchant.subscribe(data => {
      console.log('Merchant.....', data.id+':'+Object.keys(data).length);
      if(Object.keys(data).length > 0) {
        this.merchant = data;
        this.onPageLoad();
      }
    });

    this.searchForm = this.formBuilder.group({
      name: [''],
      status: ['']
    });
  }

  onPageLoad() {
    this.spinner.show();
    this.locationService.getByMerchant(this.merchant.id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Location Response', resp);
          this.locations = resp.message;
          this.locationCount = this.locations.length;
          this.inFilterMode = false;
          this.spinner.hide();
        },
        error => {
          console.log('Location Response', error);
          this.spinner.hide();
        });
  }

  create(content) {
    this.actionType = ActionEnum.add;
    this.openModal(content, 'md', 'Loccation Form');
  }

  view(id: number, content: any) {
    this.actionType = ActionEnum.view;
    this.location = this.filterLocation(id)
    this.openModal(content, 'md', 'Loccation Form');
  }

  edit(id: number, content: any) {
    this.actionType = ActionEnum.edit;
    this.location = this.filterLocation(id)
    this.openModal(content, 'md', 'Loccation Form');
  }

  filterLocation(id: number){
    return this.locations.find(m => m.id == id);
  }

  delete(id: number) {
    this.locationService.delete(id).subscribe(data => {
      console.log('Location delete success....', data);
      this.toastr.success('Location has been deleted successfully.','Location');
      this.onPageLoad();
    },
    err => {
      console.log('Location delete error....', err);
      this.toastr.error('Unable to delete location, please contact administrator.','Location');
    });
  }

  get f() { return this.searchForm['controls'] }

  searchLocations() {
    let filter = this.searchForm.value;
    filter.merchant = this.merchant.id;
    if (this.f.name.value || this.f.status.value) {
      this.locationService.searchLocations(filter).pipe(first())
        .subscribe(
          (resp: ApiResponse) => {
            console.log('Filtered Merchant Response', resp);
            this.locations = resp.message;
            this.locationCount = this.locations.length;
            this.inFilterMode = true;
            this.spinner.hide();
          },
          error => {
            this.spinner.hide();
          });
    }
  }

  clearSearchResult() {
    this.searchForm.reset();
    this.f.status.setValue("");
    this.onPageLoad();
  }

  ngOnDestroy(): void {
    this.mSub.remove;
  }
}
