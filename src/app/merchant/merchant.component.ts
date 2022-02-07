import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { faPlus, faBars, faTh, faEye, faEyeSlash, faEdit, faArchive } from '@fortawesome/free-solid-svg-icons';
import { MerchantService } from './merchant.service';
import { User } from '../model/user';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { LoginNotificationService } from '../shared/service/login-notification.service';
import { Router } from '@angular/router';
import { ApiResponse } from '../shared/model/api.response';
import { ActionEnum } from 'src/app/shared/enum/action.enum';
import { BaseComponent } from '../shared/core/base.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../shared/service/app.service';
import { countries } from '../shared/model/country-data-store'
import { FormBuilder, FormGroup } from '@angular/forms';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent extends BaseComponent {

  pageHeader: string;
  page = 1;
  pageSize = 5;

  merchants: Array<any>;
  merchantCount = 0;

  merchant;

  actionType;

  countries = countries;

  constructor(private merchantService: MerchantService,
    private appService: AppService,
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public router: Router) {
    super(modal);
  }

  ngOnInit(): void {
    this.pageHeader = 'Merchant';

    this.inFilterMode = false;

    this.statusKeys = Object.keys(this.statusEnum).filter((element) => {
      return isNaN(Number(element));
    });

    this.searchForm = this.formBuilder.group({
      name: [''],
      country: [''],
      status: [''],
    });

    this.onPageLoad();
  }

  onPageLoad() {
    this.spinner.show();
    this.merchantService.getAll()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Merchant Response', resp);
          this.merchants = resp.message;
          // for (const merchant of this.merchants) {
          //   merchant.viewApin = false;
          //   merchant.viewLpin = false;
          // }
          this.merchantCount = this.merchants.length;

          this.inFilterMode = false;
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        });
  }

  filterMerchant(id: number) {
    return this.merchants.find(m => m.id == id);
  }

  get f() { return this.searchForm['controls'] }

  searchMerchants() {
    // console.log(this.f.name.value +"||"+ this.f.country.value +"||"+ this.f.status.value);
    if (this.f.name.value || this.f.country.value || this.f.status.value) {
      this.merchantService.searchMerchants(this.searchForm.value).pipe(first())
        .subscribe(
          (resp: ApiResponse) => {
            console.log('Filtered Merchant Response', resp);
            this.merchants = resp.message;
            this.merchantCount = this.merchants.length;
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
    this.f.country.setValue("");
    this.f.status.setValue("");
    this.onPageLoad();
  }

  create(content: any) {
    this.actionType = ActionEnum.add;
    this.openModal(content, 'lg', 'Merchant Form');
  }

  view(id: number, content: any) {
    this.actionType = ActionEnum.view;
    this.merchant = this.filterMerchant(id)
    this.openModal(content, 'lg', 'Merchant Form');
  }

  edit(id: number, content: any) {
    this.actionType = ActionEnum.edit;
    this.merchant = this.filterMerchant(id)
    this.openModal(content, 'lg', 'Merchant Form');
  }

  delete(id: number) {
    this.merchantService.delete(id).subscribe(data => {
      console.log('Merchant has been deleted successfully');
      this.toastr.success('Merchant has been deleted successfully', 'Merchant');
      this.onPageLoad();
    },
      err => {
        console.log('Unable to delete merchant....', err);
        this.toastr.error('Unable to delete merchant, please contact adminstrator', 'Merchant');
      });
  }

  openMerchant(id: number) {
    this.appService.loadMerchant(this.filterMerchant(id));
    this.appService.initMerchantSession(this.filterMerchant(id));
    this.router.navigate(['/mdb']);
  }

  // get statusKeys() {
  // let keys = [];
  // Object.keys(this.statusEnum).forEach(e =>{
  //   if (isNaN(Number(e))) {
  //     console.log(this.statusEnum[e]);
  //     keys.push[e];
  //   }
  // });
  // for (let element in this.statusEnum) {
  //   if (isNaN(Number(element))) {
  //     console.log(element);
  //     keys.push[element];
  //   }
  // }
  // console.log(keys);

  // }
}
