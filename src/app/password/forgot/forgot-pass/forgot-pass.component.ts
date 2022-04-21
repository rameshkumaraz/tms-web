import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { ForgotPassService } from './forgot-pass.service';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {

  passTab: boolean;

  user: any;

  infoForm: FormGroup;
  passForm: FormGroup;
  formSubmitted = false;
  isFailed = false;
  errMsg: string;

  constructor(private formBuilder: FormBuilder,
    private service: ForgotPassService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.passTab = false;

    this.infoForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      dob: ['', [Validators.required]],
    });

    this.passForm = this.formBuilder.group({
      newPass: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]],
      confirmPass: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]]
    }, { validators: this.passwordConfirming('newPass', 'confirmPass')});
  }

  get f() { return this.infoForm.controls; }
  get p() { return this.passForm.controls; }

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

  next(){
    this.formSubmitted = true;
    if (this.infoForm.invalid) {
      console.log('From invalid', this.infoForm);
      return;
    }
    
    this.spinner.show();
    let formValue = this.infoForm.value;
    formValue.email = formValue.username;
    formValue.dob = formValue.dob;    
    this.service.verifyUser(formValue).subscribe((resp: ApiResponse) => {
      this.passTab = true;
      this.user = resp.message;
      console.log('User from userinfo....', this.user);
      this.isFailed = false;
      this.formSubmitted = false;
      this.spinner.hide();
    },
      err => {
        this.isFailed = true;
        console.log('Invalid username / DOB', err);
        if(err.code === HttpStatusCode.BadRequest || err.code === HttpStatusCode.NotFound)
          this.errMsg = 'Invalid Username / DOB';    
        else
          this.errMsg = err.message;  
        this.spinner.hide();
      });
  }

  update() {

    this.formSubmitted = true;

    // stop here if form is invalid
    if (this.passForm.invalid) {
      console.log('From invalid', this.passForm);
      return;
    }

    this.spinner.show();
    let formValue = this.passForm.value;
    formValue.id = this.user.id;
    formValue.password = formValue.newPass;
    formValue.oldPassword = formValue.oldPass;

    delete formValue.newPass;
    delete formValue.confirmPass;

    formValue.isAdmin = false;
    console.log('Role name .....', this.user.role.name);
    if(this.user.role.name.indexOf('AZ_') === 0 )
      formValue.isAdmin = true;

    console.log(formValue);

    this.service.updatePass(formValue).subscribe((resp: ApiResponse) => {
      this.toastr.success("Password has been reset successfully. Please signin with new password", "Forgot Password");
      this.spinner.hide();
      this.router.navigate(['/login']);
    },
      err => {
        this.isFailed = true;
        console.log('Password update failed, please contact adminstrator', err);
        this.errMsg = err.message;
        this.spinner.hide();
      });
  }

  cancel(){
    this.router.navigate(['/login']);
  }

}
