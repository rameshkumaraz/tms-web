import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, first } from 'rxjs/operators';
import { Merchant } from '../model/merchant';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { LocationService } from './location.service';
import { ActionEnum } from '../shared/enum/action.enum';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../shared/core/base.component';
import { FormBuilder } from '@angular/forms';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent extends BaseComponent {

  @ViewChild("locationName") locationName: ElementRef;

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

    super.ngOnInit();

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

    this.adSearchForm = this.formBuilder.group({
      name: [''],
      status: [''],
    });
  }

  ngAfterViewInit(): void {
    fromEvent(this.locationName.nativeElement, 'keyup').pipe(debounceTime(this.debounceTime)).subscribe(data => {
      this.searchLocations('name');
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
  get af() { return this.adSearchForm['controls'] }

  searchLocations(type: string) {

    console.log('Target Id....', type);
    if(type == 'name' && this.f.name.value.length < 3) {
      return;
    }
    this.spinner.show();
    if(type == 'name') {
      this.f.status.setValue('');
    } else if (type == 'status'){
      this.f.name.setValue('');
    }

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

  advancedSearch(){
    console.log(this.adSearchForm.value);
    if (this.af.name.value|| this.af.status.value) {
      this.spinner.show();
      let formValue = this.adSearchForm.value;
      formValue.merchant = this.merchant.id;
      this.locationService.searchLocations(formValue).pipe(first())
        .subscribe(
          (resp: ApiResponse) => {
            console.log('Filtered Merchant Response', resp);
            this.locations = resp.message;
            this.locationCount = this.locations.length;
            this.inFilterMode = true;
            this.closeModal(false);
            this.spinner.hide();
          },
          error => {
            this.spinner.hide();
          });
    } 
  }

  // searchLocations() {
  //   let filter = this.searchForm.value;
  //   filter.merchant = this.merchant.id;
  //   if (this.f.name.value || this.f.status.value) {
  //     this.locationService.searchLocations(filter).pipe(first())
  //       .subscribe(
  //         (resp: ApiResponse) => {
  //           console.log('Filtered Merchant Response', resp);
  //           this.locations = resp.message;
  //           this.locationCount = this.locations.length;
  //           this.inFilterMode = true;
  //           this.spinner.hide();
  //         },
  //         error => {
  //           this.spinner.hide();
  //         });
  //   }
  // }

  openAdSearch(content: any){
    this.adSearchForm.reset();
    this.adSearchForm.controls['status'].setValue('');
    this.openModal(content, 'sm', 'Advanced Search');
  }

  closeAdSearch(){
    this.closeModal(false);
  }

  resetSearchForm(){
    this.searchForm.reset();
    this.f.status.setValue("");
  }

  clearSearchResult() {
    this.resetSearchForm();
    this.onPageLoad();
  }

  ngOnDestroy(): void {
    this.mSub.remove;
  }
}
