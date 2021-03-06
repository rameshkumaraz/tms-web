import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faBars, faEye, faPlus, faTh } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ApiResponse } from '../shared/model/api.response';
import { RoleService } from './role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  faBars = faBars;
  faPlus = faPlus;
  faEye = faEye;
  faTh = faTh;

  pageHeader: string;
  page = 1;
  pageSize = 10;

  roleCount = 0;
  roles: Array<any>;

  constructor(private roleService: RoleService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.pageHeader = 'Roles';
    this.onLoad();
  }

  onLoad() {
    this.spinner.show();
    this.roleService.getAllRoles()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Roles Response', resp);
          this.roles = resp.message;
          this.roleCount = this.roles.length;
          this.spinner.hide();
        },
        err => {
          console.log('Unable to load roles, please contact adminstrator', err);
          this.toastr.error('Unable to load roles, please contact adminstrator', 'Roles');
          this.spinner.hide();
        });
  }

  viewPolicies(id: number){

  }
}
