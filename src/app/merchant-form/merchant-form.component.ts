import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import mockData from '../../assets/config/verifone/merchant-form-config.json';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-merchant-form',
  templateUrl: './merchant-form.component.html',
  styleUrls: ['./merchant-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MerchantFormComponent implements OnInit {

  faCheck = faCheck;

  pageHeader = 'New Merchant';

  formTemplate: any;

  merchantForm: FormGroup;
  submitted = false;
  isFailed = false;
  errMsg: string;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formTemplate = mockData.x990;
    const group = {};
    this.formTemplate.merchant.fields.rows.forEach( row => {
        row.cols.forEach( control => {
          console.log('Field name', control.name);
          group[control.name] = new FormControl('');
        });
      });
    this.merchantForm = new FormGroup(group);
  }

}
