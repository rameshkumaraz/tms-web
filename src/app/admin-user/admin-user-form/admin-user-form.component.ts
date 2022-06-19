import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, first } from 'rxjs/operators';
import { BaseFormComponent } from 'src/app/shared/core/base-form.component';
import { ActionEnum } from 'src/app/shared/enum/action.enum';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { AdminUserService } from '../admin-user.service';
import { AdminUser } from '../../model/admin-user';
import { RoleService } from 'src/app/role/role.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-user-form',
  templateUrl: './admin-user-form.component.html',
  styleUrls: ['./admin-user-form.component.scss'],
  providers: [DatePipe]
})
export class AdminUserFormComponent extends BaseFormComponent {

  @Input() user;
  @Input() actionType;

  pageHeader = 'New User';

  userForm: FormGroup;
  formSubmitted = false;
  isFailed = false;
  errMsg: string;

  roles: Array<any>;

  filteredPolicies: Array<any>;

  min: any;
  max: any;

  constructor(private formBuilder: FormBuilder,
    private service: AdminUserService,
    private roleService: RoleService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private datePipe: DatePipe) {
    super();
  }

  ngOnInit(): void {

    this.loadActionAccess(this.componentEnum.adminUser.toString());

    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]],
      lastName: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]],
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]],
      role: ['', [Validators.required]],
      dob: ['', [Validators.required]]
    }, { validator: this.passwordConfirming('password', 'confirmPassword') });

    this.loadRoles();

    if (this.actionType != ActionEnum.add) {
      this.onPageLoad();
    }

    if (this.actionType == ActionEnum.view) {
      this.userForm.disable();
      this.pageHeader = 'View User';
    }

    if (this.actionType == ActionEnum.edit) {
      this.userForm.enable();
      this.pageHeader = 'Update User';
    }

    let date = new Date();
    this.max = this.datePipe.transform(date.setFullYear(date.getFullYear() - 20), 'yyyy-MM-dd');
    this.min = this.datePipe.transform(date.setFullYear(date.getFullYear() - 60), 'yyyy-MM-dd');

    console.log(this.min+" : "+this.max);
  }

  onPageLoad() {
    console.log('User....', this.user);
    this.userForm.setValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      password: this.user.password,
      confirmPassword: this.user.password,
      role: this.user.role.id,
      dob: this.datePipe.transform(this.user.dob, 'yyyy-MM-dd')
    });
  }

  get f() { return this.userForm['controls'] }

  setDescValidator() {
    this.f.desc.valueChanges.
      pipe(distinctUntilChanged()).
      subscribe(val => {
        if (val.length > 0 && val.length < 6) {
          this.f.desc.setValidators([Validators.minLength(5)]);
          this.f.desc.setValidators([Validators.minLength(250)]);
        } else {
          this.f.desc.clearValidators();
        }
        this.f.desc.updateValueAndValidity();
      });
  };

  passwordConfirming(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ inValid: true })
      }
      else {
        return passwordConfirmationInput.setErrors(null);
      }
    }
  }

  loadRoles() {
    let isAdmin = false;
    if (this.authService.getRole().indexOf('AZ_') === 0)
      isAdmin = true;

    this.roleService.getRoles(isAdmin)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Roles Response', resp);
          this.roles = resp.message;
          this.spinner.hide();
        },
        err => {
          console.log('Unable to load roles, please contact adminstrator', err);
          this.toastr.error('Unable to load roles, please contact adminstrator', 'Admin Users');
          this.spinner.hide();
        });
  }

  save() {
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.userForm.invalid) {
      console.log('From invalid', this.userForm);
      return;
    }
    this.spinner.show();
    let value = this.userForm.value;
    value.role = +value.role;

    // console.log('Form value....', value);

    this.service.create(value).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("User has been created successfully.", "Admin Users");
      this.close(true);
    },
      err => {
        console.log('Unable to create user, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to create user, please contact adminstrator', "Admin Users");
        this.spinner.hide();
      });
  }

  update() {
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.userForm.invalid) {
      console.log('From invalid', this.userForm);
      return;
    }
    this.spinner.show();
    let userToUpdate = <AdminUser>this.userForm.value;
    // console.log("Update form value...", this.userForm.value);
    // Object.assign(this.user, userToUpdate);
    this.user.firstName = userToUpdate.firstName;
    this.user.lastName = userToUpdate.lastName;
    this.user.dob = userToUpdate.dob;
    this.user.canEdit = !!this.user.canEdit;
    this.user.canView = !!this.user.canEdit;
    this.user.role = this.user.role.id;

    console.log("User for update...", this.user);

    let value = this.user;
    delete value.password;
    delete value.confirmPassword;
    // value.role = this.user.role;

    console.log('Form value....', value);

    this.service.update(value).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("User has been updated successfully.", "Admin Users");
      this.close(true);
    },
      err => {
        this.spinner.hide();
        console.log('Unable to update user, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to update user, please contact adminstrator', "Admin Users");
      });
  }

  edit() {
    this.actionType = ActionEnum.edit;
    this.pageHeader = 'Update User';
    this.userForm.enable();
    this.f.email.disable();
    this.f.role.disable();
  }

  delete() {
    this.service.delete(this.user.id).subscribe(data => {
      this.close(true);
      this.toastr.success('User has been deleted successfully.', 'Admin Users');
    },
      err => {
        console.log('Unable to delete user, please contact administrator.', 'Admin Users');
        this.toastr.error('Unable to delete user, please contact administrator.', 'Admin Users');
      });
  }

  updateStatus(id: number, status: number): void {
    this.spinner.show();
    let model = Object.assign({}, this.user);
    model.status = status;  
    this.service.updateStatus(id, model).subscribe(data => {
      this.close(true);
      console.log('User status has been updated successfully');
      this.toastr.success('User status has been updated successfully', 'Admin Users');
    },
      err => {
        console.log('Unable to update user status....', err);
        this.toastr.error('Unable to update user status, please contact adminstrator', 'Admin Users');
        this.spinner.hide();
      });
  }
}
