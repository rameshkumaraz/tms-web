import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged } from 'rxjs/operators';
import { Application } from 'src/app/model/application';
import { BaseComponent } from 'src/app/shared/core/base.component';
import { ActionEnum } from 'src/app/shared/enum/action.enum';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { AppService } from 'src/app/shared/service/app.service';
import { ApplicationService } from '../application.service';

@Component({
  selector: 'app-application-form',
  templateUrl: 'application-form.component.html',
  styleUrls: ['application-form.component.scss']
})
export class ApplicationFormComponent extends BaseComponent {

  @Input() merchant;
  @Input() app;
  @Input() actionType;

  pageHeader = 'New Application';
  page = 1;
  pageSize = 10;

  appForm: FormGroup;
  formSubmitted = false;
  isFailed = false;
  errMsg: string;

  mSub;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private service: ApplicationService,
    private appService: AppService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super(null);
  }

  ngOnInit(): void {
    // console.log(this.authService.getCurrentUser());
    this.appForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.max(100)]],
      type: ['', [Validators.required, Validators.minLength(1), Validators.max(25)]],
      appVersion: ['', [Validators.required, Validators.minLength(1), Validators.max(10)]],
      desc: ['']
    });

    if (this.actionType != ActionEnum.add) {
      this.onPageLoad();
    }

    if (this.actionType == ActionEnum.view) {
      this.appForm.disable();
      this.pageHeader = 'View Application';
    }

    if (this.actionType == ActionEnum.edit) {
      this.appForm['controls'].name.disable();
      this.pageHeader = 'Update Application';
    }
  }

  onPageLoad() {
    this.appForm.setValue({
      name: this.app.name,
      type: this.app.type,
      appVersion: this.app.appVersion,
      desc: this.app.desc,
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
    this.app.merchant = this.merchant.id;

    this.service.create(this.app).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Application has been created successfully.", "Application");
      this.close(true);
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

    this.app.canEdit = !!this.app.canEdit;
    this.app.canView = !!this.app.canEdit;

    this.service.update(this.app).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Application has been updated successfully.", "Application");
      this.close(true);
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
    this.pageHeader = 'Update Application';
    this.appForm.enable();
    this.f.name.disable();
  }

  delete() {
    this.service.delete(this.app.id).subscribe(data => {
      this.toastr.success('Application has been deleted successfully', 'Application')
      this.close(true);
    },
    err => {
      console.log('Unable to delete application, please contact administrator.', 'Application');
      this.toastr.error('Unable to delete application, please contact administrator.', 'Application');
    });
  }
}
