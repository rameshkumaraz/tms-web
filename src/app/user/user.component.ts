import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { Merchant } from '../model/merchant';
import { ActionEnum } from '../shared/enum/action.enum';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { UserService } from './user.service';
import { BaseComponent } from '../shared/core/base.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends BaseComponent {

  pageHeader: string;
  page = 1;
  pageSize = 10;

  userCount = 0;
  users: Array<any>;

  user: any;

  merchant: Merchant;

  actionType;

  mSub;

  constructor(private userService: UserService,
    private appService: AppService,
    private service: UserService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {
    this.pageHeader = 'Users';
    this.mSub = this.appService.userMerchant.subscribe(data => {
      console.log('User Merchant.....', data.id + ':' + Object.keys(data).length);
      if (Object.keys(data).length > 0) {
        this.merchant = data;
        this.onPageLoad();
      }
    });
  }

  onPageLoad() {
    this.spinner.show();

    this.userService.getUsersForMerchant(this.merchant.id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Users Response', resp);
          this.users = resp.message;
          this.userCount = this.users.length;
          this.spinner.hide();
        },
        err => {
          console.log('Unable to load users, please contact adminstrator', err);
          this.toastr.error('Unable to users roles, please contact adminstrator', 'User');
          this.spinner.hide();
        });
  }

  create(content: any) {
    this.actionType = ActionEnum.add;
    this.openModal(content, 'md', 'User Form');
  }

  view(id: number, content: any) {
    this.actionType = ActionEnum.view;
    this.user = this.filterUser(id)
    this.openModal(content, 'md', 'User Form');
  }

  edit(id: number, content: any) {
    this.actionType = ActionEnum.edit;
    this.user = this.filterUser(id)
    this.openModal(content, 'md', 'User Form');
  }

  filterUser(id: number) {
    return this.users.find(m => m.id == id);
  }

  delete(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('User delete success....', data);
      this.toastr.success('User has been deleted successfully', 'User');
      this.onPageLoad();
    },
      err => {
        console.log('User delete error....', err);
        this.toastr.error('Unable to delete user, please contact administrator.', 'User');
      });
  }

  ngOnDestroy(): void {
    this.mSub.remove;
  }
}
