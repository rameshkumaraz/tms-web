import { Component, OnInit, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '../utils/services/authentication.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  @Input() showHeader: boolean;

  // @Output() modelClosed = new EventEmitter();

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
  }

  get f() { return this.loginForm.controls; }

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
      this.appService.loadUserMerchant();
      this.spinner.hide();

      let profile = JSON.parse(resp.message.user_profile);
      // console.log('roleId....', profile.roleId);
      if (profile.roleId === 1)
        this.router.navigate(['/db']);
      else
        this.router.navigate(['/mdb']);

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
  //   this.modelClosed.emit(true);
  // }
}
