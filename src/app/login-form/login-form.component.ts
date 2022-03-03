import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import menuAccess from '../../assets/config/menu-access.json';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  @Input() showHeader: boolean;

  // @Output() modalClosed = new EventEmitter();

  faTimes = faTimes;

  loginForm: FormGroup;
  submitted = false;
  isFailed = false;
  errMsg: string;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private appService: AppService,
    private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.authService.logout();
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.resetMenuAccess();
  }

  get f() { return this.loginForm.controls; }

  resetMenuAccess(){
    Object.keys(menuAccess).forEach(function (key) {
      menuAccess[key] = false;
    });
  }

  // asGuest(){
  //   sessionStorage.setItem('currentUser', JSON.stringify({'Guest'}));
  //   this.spinner.hide();
  //   this.router.navigate(['/merchant']);
  // }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    const bodyJSON = this.loginForm.value;
    this.spinner.show();
    this.authService.login(bodyJSON).subscribe((resp: ApiResponse) => {
      console.log(resp);
      sessionStorage.setItem('access_token', resp.message.access_token);
      sessionStorage.setItem('user_profile', resp.message.user_profile);
      this.authService.loadUserProfile();
      this.spinner.hide();

      let profile = JSON.parse(resp.message.user_profile);
      // console.log('roleId....', profile.roleId);
      if (profile.roleName.indexOf('AZ_') === 0)
        this.router.navigate(['/db']);
      else {
        this.appService.loadMerchantFromUser();
        this.router.navigate(['/mdb']);
      }

    },
      err => {
        console.log('Login error', err);
        if (err.code === 401) {
          this.authService.logout();
          // location.reload();
        }
        this.errMsg = err.message;
        this.isFailed = true;
        this.spinner.hide();
      });
  }

  // close() {
  //   // /console.log('close invoked');
  //   this.modalClosed.emit(true);
  // }
}
