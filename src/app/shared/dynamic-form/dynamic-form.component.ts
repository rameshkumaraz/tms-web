import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormField } from '../model/form.field';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Merchant } from 'src/app/model/merchant';
import { currencies } from '../../shared/model/currency-data-store'
import { BaseComponent } from '../core/base.component';
import { DynamicFormService } from './dynamic-form.service';
import { BaseService } from '../core/base.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from '../model/api.response';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  providers: [
    {provide: 'module', useValue: 'module'},
  ],
  encapsulation: ViewEncapsulation.None
})
export class DynamicFormComponent extends BaseComponent {

  //@Input() merchant: Merchant;
  @Input() formTitle: string;
  @Input() formConfig: any;
  @Input() formValue: any;
  @Input() service: any;
  @Input() actionType;

  currencies: any = currencies;

  faTimes = faTimes;
  faCheck = faCheck;

  formGroup: FormGroup;
  submitted = false;
  isFailed = false;
  errMsg: string;

  steps = [];
  formGroups = [];
  formType = "simple";

  form: FormGroup;

  formSubmitted = false;

  isFormValid = false;

  dynamicFormValue = {};

  phoneRegEx = /^\+(?:[0-9] ?){6,14}[0-9]$/;
  ipRegEx = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

  constructor(private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {

    console.log(this.formConfig.type);
    console.log('Service.....', this.service);
    if (this.formConfig.type == "multi-step") {

      this.formType = "multi-stpe";
      this.formConfig.steps.forEach(function (step, i) {
        const formControls = {};
        this.steps.push(
          {
            "step_idx": i,
            "step_name": step.display_name,
            "form_name": step.name,
            "fields": step.fields
          });

        step.fields.rows.forEach(row => {
          let controls = [];
          row.cols.forEach(control => {
            //console.log('Field name', control.name);

            let formControl = new FormControl('');
            if (control.validation) {
              if (control.validation.mandatory)
                formControl.addValidators(Validators.required);
              if (control.validation.min)
                formControl.addValidators(Validators.minLength(control.validation.min));
              if (control.validation.max)
                formControl.addValidators(Validators.maxLength(control.validation.max));
              if (control.validation.type == 'email')
                formControl.addValidators(Validators.email);
              if (control.validation.type == 'mobile' || control.validation.type == 'phone')
                formControl.addValidators(Validators.pattern(this.phoneRegEx));
              if (control.validation.type == 'ip')
                formControl.addValidators(Validators.pattern(this.ipRegEx));
            }
            formControls[control.name] = formControl;
          });
        });
        this.formGroups[i] = new FormGroup(formControls);
      }, this)
      console.log("Steps....", this.formGroups);
      this.form = this.formGroups[0];
      console.log("Steps....", this.form);
    } else {

    }
  }

  onPageLoad() {
    throw new Error('Method not implemented.');
  }

  reset() {

  }

  save() {
    console.log('nextTab');
    this.formSubmitted = true;
    // stop here if form is invalid
    // if (this.form.invalid) {
    //   console.log('From invalid', this.appForm);
    //   return;
    // }
    this.spinner.show();
    const mergedObj = Object.assign(this.service.getRelation(), {});
    mergedObj['params'] = JSON.stringify(this.dynamicFormValue);
    console.log('Form value ......', mergedObj);
    // this.app = this.appForm.value;
    // this.app.merchant = this.merchant.id;

    this.service.create(mergedObj).subscribe((resp: ApiResponse) => {
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
    // this.formSubmitted = true;
    // // stop here if form is invalid
    // if (this.appForm.invalid) {
    //   console.log('From invalid', this.appForm);
    //   return;
    // }
    // this.spinner.show();
    // let appToUpdate = <Application>this.appForm.value;
    // Object.assign(this.app, appToUpdate);

    // this.app.canEdit = !!this.app.canEdit;
    // this.app.canView = !!this.app.canEdit;

    // this.service.update(this.app).subscribe((resp: ApiResponse) => {
    //   this.spinner.hide();
    //   this.toastr.success("Application has been updated successfully.", "Application");
    //   this.close(true);
    // },
    //   err => {
    //     console.log('Unable to update application, please contact adminstrator', err);
    //     this.errMsg = err.message;
    //     this.toastr.error('Unable to update application, please contact adminstrator', "Application");
    //     this.spinner.hide();
    //   });
  }

  // edit() {
  //   this.actionType = ActionEnum.edit;
  //   this.pageHeader = 'Update Application';
  //   this.appForm.enable();
  //   this.f.name.disable();
  // }

  delete() {
    // this.service.delete(this.app.id).subscribe(data => {
    //   this.toastr.success('Application has been deleted successfully', 'Application')
    //   this.close(true);
    // },
    // err => {
    //   console.log('Unable to delete application, please contact administrator.', 'Application');
    //   this.toastr.error('Unable to delete application, please contact administrator.', 'Application');
    // });
  }

  // close(reload: boolean) {
  //   console.log('close invoked');
  //   this.modalClosed.emit({ reload: reload });
  // }

  prevTab(idx: number) {
    if (idx >= 0) {
      this.form = this.formGroups[idx - 1];
    }
    console.log("Previous step from.....", this.form);
  }

  nextTab(idx: number) {
    this.dynamicFormValue[this.steps[idx].step_name] = this.form.value;
    if (idx < this.formGroups.length - 1) {
      this.form = this.formGroups[idx + 1];
    }
    console.log("Next step FormValue.....", this.dynamicFormValue);
  }

  getValue(step: string, name: string) {
    if (this.dynamicFormValue[step]) {
      return this.dynamicFormValue[step][name];
    }
    return '';
  }

}
