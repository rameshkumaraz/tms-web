import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '../utils/services/authentication.service';
import { ApiResponse } from '../shared/model/api.response';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  @Input() showHeader: boolean;
  @Input() isPopup: boolean;

  faTimes = faTimes;

  loginForm: FormGroup;
  submitted = false;
  isFailed = false;
  errMsg: string;

  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
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
    this.authenticationService.login(bodyJSON)
      .pipe(first())
      .subscribe(
        resp => {
          console.log('Response', resp);
          if(!resp.ok) {
            this.spinner.hide();
            this.isFailed = true;
            this.errMsg = resp.body;
            return;
          }
          sessionStorage.setItem('currentUser', JSON.stringify(resp.body));
          this.spinner.hide();
          if (!this.isPopup) {
            this.router.navigate(['/merchant']);
          } else {
            this.errMsg = '';
            return;
          }

        },
        error => {
          this.isFailed = true;
          this.spinner.hide();
        });
  }
}
