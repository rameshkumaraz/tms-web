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

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent implements OnInit {

  faBars = faBars;
  faPlus = faPlus;
  faEye = faEye;
  faEdit = faEdit;
  faArchive = faArchive;
  faTh = faTh;

  pageHeader: string;
  page = 1;
  pageSize = 5;

  mode = 2;

  user: User;

  merchants: Array<any>;
  merchantCount = 0;

  constructor(private merchantService: MerchantService,
    private loginNotifyService: LoginNotificationService,
    private spinner: NgxSpinnerService,
    private router: Router) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    this.pageHeader = 'Merchant';
    this.onLoad();
    this.loginNotifyService.events$.pipe(first())
    .subscribe(
      resp => {
        this.user = resp;
        this.onLoad();
      });
  }

  onLoad() {
    this.spinner.show();
    this.merchantService.getAllMerchants()
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
        });
  }

  changeView() {
    this.mode = this.mode === 1 ? 2 : 1;
  }

  createMerchant(){
    this.router.navigate(['/mf', {actionType: ActionEnum.add}],{skipLocationChange: true});
  }

  viewMerchant(id: number) {
    this.router.navigate(['/mf', {actionType: ActionEnum.view, id: id}],{skipLocationChange: true});
  }

  editMerchant(id: number) {
    this.router.navigate(['/mf', {actionType: ActionEnum.edit, id: id}],{skipLocationChange: true});
  }

  deleteMerchant(id: number) {
    
  }

  onToggleAeccessIcon(id: number) {
    for (const merchant of this.merchants) {
      if (merchant.id === id) {
        merchant.viewApin = merchant.viewApin === true ? false : true;
      }
    }
  }

  onToggleLoginIcon(id: number) {
    for (const merchant of this.merchants) {
      if (merchant.id === id) {
        merchant.viewLpin = merchant.viewLpin === true ? false : true;
      }
    }
  }
}
