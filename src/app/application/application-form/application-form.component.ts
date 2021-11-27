import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged } from 'rxjs/operators';
import { Application } from 'src/app/model/application';
import { ActionEnum } from 'src/app/shared/enum/action.enum';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { ApplicationService } from '../application.service';

@Component({
  selector: 'app-application-form',
  templateUrl: 'application-form.component.html',
  styleUrls: ['application-form.component.scss']
})
export class ApplicationFormComponent implements OnInit {

  actionType;
  appId;

  pageHeader = 'New Application';
  page = 1;
  pageSize = 10;

  appForm: FormGroup;
  formSubmitted = false;
  isFailed = false;
  errMsg: string;

  app: Application;

  sub;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private service: ApplicationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.sub = this.activatedroute.paramMap.subscribe(params => {
      console.log(params);
      this.actionType = params.get('actionType');
      this.appId = params.get('id');
    });

    // console.log(this.authService.getCurrentUser());
    this.appForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]],
      type: ['', [Validators.required, Validators.minLength(1), Validators.max(25)]],
      appVersion: ['', [Validators.required, Validators.minLength(1), Validators.max(10)]],
      desc: ['']
    });

    if (this.actionType != ActionEnum.add) {
      this.onLoad();
    }

    if (this.actionType == ActionEnum.view) {
      this.appForm.disable();
    }
  }

  onLoad() {
    this.spinner.show();
    this.service.getById(this.appId).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.app = resp.message;
      this.appForm.setValue({
        name: this.app.name,
        type: this.app.type,
        appVersion: this.app.appVersion,
        desc: this.app.desc,
      });
    },
      err => {
        console.log('Unable to load application, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error(this.errMsg, "Application");
        this.spinner.hide();
      });
  }

  get f() { return this.appForm['controls'] }

  setDescValidator() {
    this.f.desc.valueChanges.
      pipe(distinctUntilChanged()).
      subscribe(val => {
        console.log('desc value', val + ':' + val.length);
        if (val.length > 0 && val.length < 6) {
          this.f.desc.setValidators([Validators.minLength(5)]);
          this.f.desc.setValidators([Validators.minLength(250)]);
        } else {
          this.f.desc.clearValidators();
        }
        this.f.desc.updateValueAndValidity();
      });
  };

  save() {
    console.log('nextTab');
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.appForm.invalid) {
      console.log('From invalid', this.appForm);
      return;
    }
    this.spinner.show();
    this.app = <Application>this.appForm.value;

    this.service.create(this.app).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Application has been created successfully.", "Application");
      this.router.navigate(['/application']);
    },
      err => {
        console.log('Unable to create application, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to create application, please contact adminstrator', "Application");
        this.spinner.hide();
      });
  }

  update() {
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.appForm.invalid) {
      console.log('From invalid', this.appForm);
      return;
    }
    this.spinner.show();
    let appToUpdate = <Application>this.appForm.value;
    Object.assign(this.app, appToUpdate);

    this.service.update(this.app).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Application has been updated successfully.", "Application");
      this.router.navigate(['/application']);
    },
      err => {
        console.log('Unable to update application, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to update application, please contact adminstrator', "Application");
        this.spinner.hide();
      });
  }

  edit() {
    this.actionType = ActionEnum.edit;
    this.appForm.enable();
  }

  delete() {
    this.service.delete(this.app.id).subscribe(data => {
      this.toastr.success('Application has been deleted successfully', 'Application')
      this.router.navigate(['/application']);
    },
    err => {
      console.log('Unable to delete application, please contact administrator.', 'Application');
      this.toastr.error('Unable to delete application, please contact administrator.', 'Application');
    });
  }

  cancel() {
    this.router.navigate(['/application']);
  }


  public get actionEnum(): typeof ActionEnum {
    return ActionEnum; 
  }

}
