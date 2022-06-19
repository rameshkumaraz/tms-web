import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseFormComponent } from 'src/app/shared/core/base-form.component';
import { MerchantConfigType } from 'src/app/shared/enum/merchant-config-type.enum';
import { LicenseType } from 'src/app/shared/enum/license.enum';
import { ActionEnum } from 'src/app/shared/enum/action.enum';

@Component({
  selector: 'app-msettings-form',
  templateUrl: './msettings-form.component.html',
  styleUrls: ['./msettings-form.component.scss']
})
export class MsettingsFormComponent extends BaseFormComponent {

  @Input() item;
  @Input() actionType;

  form: FormGroup;

  formSubmitted = false;
  isFailed = false;

  pageHeader = 'Add Config Item';

  isLicense = false;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {

    // this.form = this.fb.group({   
    //   items: this.fb.array([])  
    // });  

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.max(50)]],
      value: ['', [Validators.required, Validators.minLength(5), Validators.max(50)]]
    });

    // this.configItems.push(this.newItem());  
  }

  get f() { return this.form['controls'] } l

  // get configItems() : FormArray {  
  //   // console.log('form.............',this.form);
  //   return this.form.get("items") as FormArray  
  // }  

  // newItem(): FormGroup {  
  //   return this.fb.group({  
  //     name: '',  
  //     value: '',  
  //   })  
  // }  

  // addItem() {  
  //   this.configItems.push(this.newItem());  
  // }  

  // removeItem(i:number) {  
  //   this.configItems.removeAt(i);  
  // }  

  onNameChange(name: any) {
    console.log(MerchantConfigType[name] +'=='+  MerchantConfigType.license);
    if(MerchantConfigType[name] ==  MerchantConfigType.license){
      this.isLicense = true;
    } else {
      this.isLicense = false;
    }
  }

  addItem() {  
    
  } 

  edit() {
    this.actionType = ActionEnum.edit;
    this.form.enable();
    this.pageHeader = 'Update Config Item';
    this.f.name.disable();
  }


  save() {

  }

  update() {

  }

  get merchantConfigTypes(): typeof MerchantConfigType {
    return MerchantConfigType;
  }

  get configTypes(): Array<string> {
    return Object.keys(MerchantConfigType);
  }

  get licenseTypes(): Array<string> {
    return Object.keys(LicenseType);
  }

}
