import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormField } from '../model/form.field';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
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
            if(control.validation) {
              if(control.validation.mandatory)
                formControl.addValidators(Validators.required);
              if(control.validation.min)
                formControl.addValidators(Validators.minLength(control.validation.min));  
              if(control.validation.max)
                formControl.addValidators(Validators.maxLength(control.validation.max));    
              if(control.validation.type == 'email')  
                formControl.addValidators(Validators.email); 
              if(control.validation.type == 'mobile' || control.validation.type == 'phone')  
                formControl.addValidators(Validators.pattern(this.phoneRegEx));  
              if(control.validation.type == 'ip')  
                formControl.addValidators(Validators.pattern(this.ipRegEx));     
            }
            formControls[control.name] = formControl;
            // if(control.validation)
            // controls.push({
            //   [control.name] : ['', [control.validation.mandatory? Validators.required: Validators.]]
            // });
          });
        });
        this.formGroups[i] = new FormGroup(formControls);
      }, this)
      console.log("Steps....", this.formGroups);
      this.form = this.formGroups[0];
      console.log("Steps....", this.form);
    } else {

    }

    // this.formConfig.fields.rows.forEach(row => {
    //   row.cols.forEach(control => {
    //     console.log('Field name', control.name);
    //     formControls[control.name] = new FormControl('');
    //   });
    // });
    // this.formGroup = new FormGroup(formControls);
  }

  reset() {

  }

  save() {

  }

  saveMore() {

  }

  cancel() {

  }

  isValid(name: string){
    console.log("control name....", name);
    console.log("control ....", this.form.get(name));
    if(this.form.get(name) && this.form.get(name).invalid)
      return false;
  }

  // get canExit(){
    
  //   if(this.form.valid) {
  //     this.formSubmitted = false;
  //     return true;
  //   } else {
  //     this.formSubmitted = true;
  //     return false;
  //   }
  // }

  nextTab(idx: number){
    
    // console.log("Next tab is invalid.....", this.form.invalid);
    // console.log("Next tab controls.....", this.form.controls);
    // console.log("Next tab value.....", this.form.value);
    // if(this.form.invalid) 
    //   return false;
    // else {  
      //this.isFormValid = true; 
      if(idx < this.formGroups.length-1) 
        this.form = this.formGroups[idx+1];
      
      // console.log('Form on next tab....', this.form);  
      // this.formSubmitted = false;
    // }
    // return true;
    //console.log("Next tab is form valid.....", this.isFormValid);
  }

  close() {
    this.modelClosed.emit(true);
  }

}
