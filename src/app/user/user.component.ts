import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArchive, faBars, faEdit, faEye, faPlus, faTh } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ApiResponse } from '../shared/model/api.response';
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

  constructor(private userService: UserService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.pageHeader = 'Users';
    this.onLoad();
  }

  onLoad() {
    this.spinner.show();
    this.userService.getAllRoles()
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
          this.toastr.error('Unable to load users, please contact adminstrator', 'Roles');
          this.spinner.hide();
        });
  }

  createUser() {
    this.router.navigate(['/userForm', { actionType: 'add' }]);
  }

  viewUser(id: number) {
    this.router.navigate(['/userForm', { actionType: 'view', id }]);
  }

  editUser(id: number) {
    this.router.navigate(['/userForm', { actionType: 'edit', id }]);
  }

  deleteUser(id: number) {

  }
}
