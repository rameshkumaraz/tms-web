import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ResetPassService } from './reset-pass.service';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { AuthenticationService } from 'src/app/auth/services';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss']
})
export class ResetPassComponent implements OnInit {

  @Input() user;

  @Output() modalClosed = new EventEmitter();

  passForm: FormGroup;
  formSubmitted = false;
  isFailed = false;
  errMsg: string;

  constructor(private formBuilder: FormBuilder,
    private service: ResetPassService,
    private authService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
  }

  // ngOnInit(): void {
  //   this.passForm = new FormGroup({
  //     oldPass: new FormControl(['', [Validators.required, Validators.minLength(5), Validators.max(100)]]),
  //     newPass: new FormControl(['', [Validators.required, Validators.minLength(5), Validators.max(100)]]),
  //     confirmPass: new FormControl(['', [Validators.required, Validators.minLength(5), Validators.max(100)]]),
  //   }, {validators: this.passwordConfirming('', '')});
  // }

  ngOnInit(): void {
    this.passForm = this.formBuilder.group({
      oldPass: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]],
      newPass: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]],
      confirmPass: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]],
    }, { validators: [this.passwordNew('oldPass', 'newPass'), this.passwordConfirming('newPass', 'confirmPass')] });
  }

  passwordNew(passwordKey: string, newPasswordKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        newPasswordInput = group.controls[newPasswordKey];
      if (passwordInput.value == newPasswordInput.value) {
        return newPasswordInput.setErrors({ inValid: true })
      } else {
        return newPasswordInput.setErrors(null);
      }
    }
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

  get f() { return this.passForm['controls'] }

  update() {
    // stop here if form is invalid
    if (this.passForm.invalid) {
      console.log('From invalid', this.passForm);
      return;
    }
    this.formSubmitted = true;
    this.spinner.show();
    let formValue = this.passForm.value;
    formValue.id = this.user.id;
    formValue.password = formValue.newPass;
    formValue.oldPassword = formValue.oldPass;
    

    delete formValue.oldPass;
    delete formValue.newPass;
    delete formValue.confirmPass;

    formValue.isAdmin = false;
    if(this.authService.isAdmin())
      formValue.isAdmin = true;

    console.log(formValue);

    this.service.updatePass(formValue).subscribe((resp: ApiResponse) => {
      this.toastr.success("Password has been created successfully. Please signin with new password", "Reset Password");
      this.closeModal();
      this.spinner.hide();
    },
      err => {
        this.isFailed = true;
        console.log('Password update failed, please contact adminstrator', err);
        this.errMsg = err.statusText;  
        this.spinner.hide();
      });
  }

  closeModal() {
    console.log('closeModel invoked');
    this.modalClosed.emit();
  }

}
