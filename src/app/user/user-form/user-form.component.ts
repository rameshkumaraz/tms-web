import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user.service';
import { User } from '../../model/user';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { RoleService } from 'src/app/role/role.service';
import { Merchant } from 'src/app/model/merchant';
import { BaseComponent } from 'src/app/shared/core/base.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [DatePipe]
})
export class UserFormComponent extends BaseComponent {

  @Input() merchant: Merchant;
  @Input() user: any;
  @Input() actionType;

  pageHeader = 'New User';
  page = 1;
  pageSize = 10;

  roles: Array<any>;

  userForm: FormGroup;
  formSubmitted = false;
  isFailed = false;

  min: any;
  max: any;

  sub;

  constructor(private formBuilder: FormBuilder,
    private service: UserService,
    private roleService: RoleService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private datePipe: DatePipe) {
    super(null);
  }

  ngOnInit(): void {

    console.log('Merchant.....', this.merchant);

    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]],
      lastName: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]],
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]],
      role: [''],
      merchant: [this.merchant.id + ""],
      dob: ['', [Validators.required]]
    }, { validator: this.passwordConfirming('password', 'confirmPassword') });

    this.loadRoles();

    if (this.actionType != this.actionEnum.add) {
      this.onPageLoad();
    }

    if (this.actionType == this.actionEnum.view) {
      this.userForm.disable();
      this.pageHeader = 'View User';
    }

    if (this.actionType == this.actionEnum.edit) {
      this.pageHeader = 'Update User';
      this.userForm['controls'].email.disable();
    }

    let date = new Date();
    this.max = this.datePipe.transform(date.setFullYear(date.getFullYear() - 20), 'yyyy-MM-dd');
    this.min = this.datePipe.transform(date.setFullYear(date.getFullYear() - 60), 'yyyy-MM-dd');
  }

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
    console.log('Load roles.....');
    this.roleService.getRoles(false).subscribe((resp: ApiResponse) => {
      console.log('Load roles.....', resp);
      this.roles = resp.message;
    },
      err => {
        console.log('Unable to load roles, please contact adminstrator', err);
        this.toastr.error('Unable to load rolles, please contact adminstrator', "User");
        this.spinner.hide();
      });
  }

  onPageLoad() {
    this.userForm.setValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      password: this.user.password,
      confirmPassword: this.user.password,
      role: this.user.role.id + "",
      merchant: this.user.merchant.id + "",
      dob: this.datePipe.transform(this.user.dob, 'yyyy-MM-dd')
    });

  }

  get f() { return this.userForm['controls'] }

  save() {
    console.log('nextTab');
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.userForm.invalid) {
      console.log('From invalid', this.userForm);
      return;
    }
    this.spinner.show();
    this.user = <User>this.userForm.value;
    this.user.role = +this.user.role;
    this.user.merchant = +this.user.merchant;

    this.service.create(this.user).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("User has been created successfully.", "User");
      this.close(true);
    },
      err => {
        console.log('Unable to create user, please contact adminstrator', err);
        this.toastr.error('Unable to create user, please contact adminstrator', "User");
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
    let userToUpdate = <User>this.userForm.value;
    // console.log("Update form value...", this.userForm.value);
    // Object.assign(this.user, userToUpdate);
    this.user.firstName = userToUpdate.firstName;
    this.user.lastName = userToUpdate.lastName;
    this.user.dob = userToUpdate.dob;
    this.user.canEdit = !!this.user.canEdit;
    this.user.canView = !!this.user.canEdit;
    this.user.role = this.user.role.id;
    this.user.merchant = this.user.merchant.id;

    console.log("User for update...", this.user);

    let value = this.user;
    delete value.password;
    delete value.confirmPassword;

    this.service.update(this.user).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("User has been updated successfully.", "User");
      this.close(true);
    },
      err => {
        console.log('Unable to update user, please contact adminstrator', err);
        this.toastr.error('Unable to update user, please contact adminstrator', "User");
        this.spinner.hide();
      });
  }

  edit() {
    this.actionType = this.actionEnum.edit;
    this.userForm.enable();
    this.pageHeader = 'Update User';
    this.f.email.disable();
    this.f.role.disable();
  }

  delete() {
    this.service.delete(this.user.id).subscribe(data => {
      this.toastr.success('User has been deleted successfully', 'User')
      this.close(true);
    },
      err => {
        console.log('Unable to delete user, please contact administrator.', 'User');
        this.toastr.error('Unable to delete user, please contact administrator.', 'User');
      });
  }

  cancel() {
    this.close(false);
  }
}
