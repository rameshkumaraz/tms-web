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
  loginUser: any;

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

    this.loginUser = this.authService.getCurrentUser();

    this.loadActionAccess(this.componentEnum.user.toString());

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

  hasUserAccess(action: any, id: any) {
    console.log(id+" : "+ this.authService.getCurrentUser().id)
      if(id == this.authService.getCurrentUser().id){
        return false;
      }
      this.hasAccess(action);
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
    this.spinner.show();
    this.service.delete(id).subscribe(data => {
      console.log('User delete success....', data);
      this.toastr.success('User has been deleted successfully', 'User');
      this.onPageLoad();
    },
      err => {
        console.log('User delete error....', err);
        this.toastr.error('Unable to delete user, please contact administrator.', 'User');
        this.spinner.hide();
      });
  }

  updateStatus(id: number, status: number) {
    this.spinner.show();
    let model = Object.assign({}, this.filterUser(id));
    model.status = status;
    this.service.updateStatus(id, model).subscribe(data => {
      console.log('User status has been updated successfully');
      this.toastr.success('User status has been updated successfully', 'User');
      this.onPageLoad();
      this.spinner.hide();
    },
      err => {
        console.log('Unable to update user status....', err);
        this.toastr.error('Unable to update user status, please contact adminstrator', 'User');
        this.spinner.hide();
      });
  }

  ngOnDestroy(): void {
    this.mSub.remove;
  }
}
