import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ApiResponse } from '../shared/model/api.response';
import { AuthenticationService } from '../auth/services/authentication.service';
import { RoleService } from './role.service';
import { BaseComponent } from '../shared/core/base.component';
import { ActionEnum } from '../shared/enum/action.enum';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent extends BaseComponent {

  pageHeader: string;
  page = 1;
  pageSize = 10;

  roleCount = 0;
  roles: Array<any>;

  role;

  actionType;

  constructor(private roleService: RoleService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {
    this.pageHeader = 'Roles';
    this.loadActionAccess(this.componentEnum.role.toString());
    this.onPageLoad();
  }

  onPageLoad() {
    this.spinner.show();
    let isAdmin = false;
    if (this.authService.getRole().indexOf('AZ_') === 0)
      isAdmin = true;

    this.roleService.getRoles(isAdmin)
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

  filterRole(id: number){
    return this.roles.find(r => r.id == id);
  }

  create(content: any) {
    this.actionType = ActionEnum.add;
    this.openModal(content, 'md', 'Role Form');
  }

  view(id: number, content: any) {
    this.actionType = ActionEnum.view;
    this.role = this.filterRole(id)
    this.openModal(content, 'md', 'Role Form');
  }

  edit(id: number, content: any) {
    this.actionType = ActionEnum.edit;
    this.role = this.filterRole(id)
    this.openModal(content, 'md', 'Role Form');
  }

  delete(id: number) {
    this.roleService.delete(id).subscribe(data => {
      console.log('Role has been deleted successfully');
      this.toastr.success('Role has been deleted successfully', 'Roles');
      this.onPageLoad();
    },
    err => {
      console.log('Unable to delete role....', err);
      this.toastr.error('Unable to delete role, please contact adminstrator', 'Roles');
    });
  }

  updateStatus(id: number, status: number) {
    this.spinner.show();
    let model = Object.assign({}, this.filterRole(id));
    model.status = status;
    this.roleService.updateStatus(id, model).subscribe(data => {
      console.log('Role status has been updated successfully');
      this.toastr.success('Role status has been updated successfully', 'Role');
      this.onPageLoad();
      this.spinner.hide();
    },
      err => {
        console.log('Unable to update role status....', err);
        this.toastr.error('Unable to update role status, please contact adminstrator', 'Role');
        this.spinner.hide();
      });
  }

}
