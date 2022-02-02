import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { Merchant } from '../model/merchant';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { LocationService } from './location.service';
import { ActionEnum } from '../shared/enum/action.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../shared/core/base.component';

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
    private spinner: NgxSpinnerService,
    private modal: NgbModal,
    private toastr: ToastrService) {
      super(modal);
  }

  ngOnInit(): void {
    this.pageHeader = 'Location';
    this.mSub = this.appService.userMerchant.subscribe(data => {
      console.log('Merchant.....', data.id+':'+Object.keys(data).length);
      if(Object.keys(data).length > 0) {
        this.merchant = data;
        this.onPageLoad();
      }
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

  ngOnDestroy(): void {
    this.mSub.remove;
  }
}
