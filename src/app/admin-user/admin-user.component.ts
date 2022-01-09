import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../shared/core/base.component';
import { ActionEnum } from '../shared/enum/action.enum';
import { ApiResponse } from '../shared/model/api.response';
import { AdminUserService } from './admin-user.service';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent extends BaseComponent {

  pageHeader: string;
  page = 1;
  pageSize = 10;

  userCount = 0;
  users: Array<any>;

  user;

  actionType;

  constructor(private service: AdminUserService,
    private modal: NgbModal,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super(modal);
  }

  ngOnInit(): void {
    this.pageHeader = 'Admin Users';

    this.onPageLoad();
  }

  onPageLoad() {
    this.spinner.show();    

    this.service.getAll()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('AdminUsers Response', resp);
          this.users = resp.message;
          this.userCount = this.users.length;
          this.spinner.hide();
        },
        err => {
          console.log('Unable to load users, please contact adminstrator', err);
          this.toastr.error('Unable to load users, please contact adminstrator', 'Admin Users');
          this.spinner.hide();
        });
  }

  filterUser(id: number){
    return this.users.find(r => r.id == id);
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

  delete(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('User has been deleted successfully');
      this.toastr.success('User has been deleted successfully', 'Admin Users');
      this.onPageLoad();
    },
    err => {
      console.log('Unable to delete user....', err);
      this.toastr.error('Unable to delete user, please contact adminstrator', 'Admin Users');
    });
  }

}
