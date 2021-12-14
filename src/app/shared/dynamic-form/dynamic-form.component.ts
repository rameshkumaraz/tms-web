import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormField } from '../model/form.field';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Merchant } from 'src/app/model/merchant';
import { currencies } from '../../shared/model/currency-data-store'

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DynamicFormComponent implements OnInit {

  @Input() merchant: Merchant;
  @Input() formTitle: string;
  @Input() formConfig: any;
  @Input() addMore: boolean;

  @Output() modelClosed = new EventEmitter();

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

  formValue = {};

  phoneRegEx = /^\+(?:[0-9] ?){6,14}[0-9]$/;
  ipRegEx = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

  constructor() { }

  ngOnInit(): void {

    console.log(this.formConfig.type);
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

  reset() {

  }

  save() {

  }

  saveMore() {

  }

  cancel() {

  }

  prevTab(idx: number) {
    if (idx >= 0) {
      this.form = this.formGroups[idx - 1];
    }
    console.log("Previous step from.....", this.form);
  }

  nextTab(idx: number) {
    this.formValue[this.steps[idx].step_name] = this.form.value;
    if (idx < this.formGroups.length - 1) {
      this.form = this.formGroups[idx + 1];
    }
    console.log("Next step FormValue.....", this.formValue);
  }

  getValue(step: string, name: string) {
    if (this.formValue[step]) {
      return this.formValue[step][name];
    }
    return '';
  }

  close() {
    this.modelClosed.emit(true);
  }

}
