import { Component, OnInit, Output } from '@angular/core';
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

  constructor(private merchantService: MerchantService,
    private appService: AppService,
    private modal: NgbModal,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public router: Router) { 
      super(modal);
    }

  ngOnInit(): void {
    this.pageHeader = 'Merchant';
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
          for (const merchant of this.merchants) {
            merchant.viewApin = false;
            merchant.viewLpin = false;
          }
          this.merchantCount = this.merchants.length;
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        });
  }
  filterMerchant(id: number){
    return this.merchants.find(m => m.id == id);
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

  openMerchant(id: number){
    this.appService.loadMerchant(this.filterMerchant(id));
    this.appService.initMerchantSession(this.filterMerchant(id));
    this.router.navigate(['/mdb']);
  }
}
