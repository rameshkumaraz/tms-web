import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArchive, faBars, faEdit, faEye, faPlus, faTh } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { Merchant } from '../model/merchant';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { RolesEnum } from '../utils/guards/roles.enum';
import { AuthenticationService } from '../utils/services';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  faBars = faBars;
  faPlus = faPlus;
  faEye = faEye;
  faEdit = faEdit;
  faArchive = faArchive;
  faTh = faTh;

  pageHeader: string;
  page = 1;
  pageSize = 10;

  userCount = 0;
  users: Array<any>;

  merchant: Merchant;

  constructor(private userService: UserService,
    private appService: AppService,
    private authService : AuthenticationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.pageHeader = 'Users';
    this.appService.userMerchant.subscribe(data => {
      // console.log('User Merchant.....', data.id+':'+Object.keys(data).length);
      if(Object.keys(data).length > 0) {
        this.merchant = data;
        this.onLoad();
      }
    });
  }

  onLoad() {
    this.spinner.show();
    this.spinner.show();
    if(this.authService.getRole() == RolesEnum.AZ_ROOT_ADMIN) {
      this.userService.getAdminUsers()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Roles Response', resp);
          this.users = resp.message;
          this.userCount = this.users.length;
          this.spinner.hide();
        },
        err => {
          console.log('Unable to load users, please contact adminstrator', err);
          this.toastr.error('Unable to load users, please contact adminstrator', 'User');
          this.spinner.hide();
        });
    } else {
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
    
  }

  createUser() {
    this.router.navigate(['/uf', { actionType: 'add' }]);
  }

  viewUser(id: number) {
    this.router.navigate(['/uf', { actionType: 'view', id }]);
  }

  editUser(id: number) {
    this.router.navigate(['/uf', { actionType: 'edit', id }]);
  }

  deleteUser(id: number) {

  }
}
