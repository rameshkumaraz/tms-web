import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ActionEnum } from 'src/app/shared/enum/action.enum';
import { UserService } from '../user.service';
import { User } from '../../model/user';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { RoleService } from 'src/app/role/role.service';
import { AuthenticationService } from 'src/app/utils/services';
import { Merchant } from 'src/app/model/merchant';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  @Output() modelClosed = new EventEmitter();

  @Input() merchant: Merchant;
  @Input() user: any;
  @Input() actionType;

  pageHeader = 'New Brand';
  page = 1;
  pageSize = 10;

  roles: Array<any>;

  userForm: FormGroup;
  formSubmitted = false;
  isFailed = false;

  sub;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private service: UserService,
    private roleService: RoleService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]],
      lastName: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]],
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]],
      role: [''],
      merchant: [this.merchant.id+""]
    }, { validator: this.passwordConfirming('password', 'confirmPassword') });

    this.loadRoles();

    if (this.actionType != ActionEnum.add) {
      this.onLoad();
    }

    if (this.actionType == ActionEnum.view) {
      this.userForm.disable();
      this.pageHeader = 'View User';
    }

    if (this.actionType == ActionEnum.edit) {
      this.pageHeader = 'Update User';
      this.userForm['controls'].email.disable();
    }
  }

  passwordConfirming(passwordKey: string, passwordConfirmationKey: string) {
    // if (c.get('password').value !== c.get('confirmPassword').value) {
    //     return {invalid: true};
    //     return c.get('confirmPassword').setErrors({notEquivalent: true})
    // }
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
    if (this.authService.getRole() == 'AZ_ROOT_ADMIN') {
      this.roleService.getAllRoles().subscribe((resp: ApiResponse) => {
        this.roles = resp.message;
      },
        err => {
          console.log('Unable to load roles, please contact adminstrator', err);
          this.toastr.error('Unable to load rolles, please contact adminstrator', "User");
          this.spinner.hide();
        });
    } else {
      this.roleService.getRolesForMerchant().subscribe((resp: ApiResponse) => {
        this.roles = resp.message;
      },
        err => {
          console.log('Unable to load roles, please contact adminstrator', err);
          this.toastr.error('Unable to load rolles, please contact adminstrator', "User");
          this.spinner.hide();
        });
    }
  }

  onLoad() {
    this.userForm.setValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      password: this.user.password,
      confirmPassword: this.user.password,
      role: this.user.role.id+"",
      merchant: this.user.merchant.id+""
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
    Object.assign(this.user, userToUpdate);

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
    this.actionType = ActionEnum.edit;
    this.userForm.enable();
    this.pageHeader = 'Update User';
    this.f.email.disable();
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

  close(reload: boolean) {
    console.log('close invoked');
    this.modelClosed.emit({ reload: reload });
  }


  public get actionEnum(): typeof ActionEnum {
    return ActionEnum;
  }

}
