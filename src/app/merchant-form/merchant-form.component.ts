import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { faCheck, faEdit, faArchive } from '@fortawesome/free-solid-svg-icons';
import mockData from '../../assets/config/verifone/merchant-form-config.json';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchant-form',
  templateUrl: './merchant-form.component.html',
  styleUrls: ['./merchant-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MerchantFormComponent implements OnInit {

  faCheck = faCheck;
  faEdit = faEdit;
  faArchive = faArchive;

  pageHeader = 'New Merchant';
  page = 1;
  pageSize = 10;

  formTemplate: any;

  merchantForm: FormGroup;
  terminalForm: FormGroup;
  submitted = false;
  isFailed = false;
  errMsg: string;

  terminals: Array<any>;

  constructor(private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.formTemplate = mockData.x990;
    const merchantGroup = {};
    this.formTemplate.merchant.fields.rows.forEach(row => {
      row.cols.forEach(control => {
        // console.log('Field name', control.name);
        merchantGroup[control.name] = new FormControl('');
      });
    });
    this.merchantForm = new FormGroup(merchantGroup);

    const terminalGroup = {};
    this.formTemplate.terminal.fields.rows.forEach(row => {
      row.cols.forEach(control => {
        // console.log('Field name', control.name);
        terminalGroup[control.name] = new FormControl('');
      });
    });
    this.terminalForm = new FormGroup(terminalGroup);

    this.terminals = new Array();
  }

  addTerminal(){
    this.terminals.push(this.terminalForm.value);
    console.log(this.terminals);
  }

  deleteTerminal(id: string){
    console.log('delete', id);
  }

  editTerminal(id: string){
    console.log('edit', id);
  }

  cancel(){
    this.router.navigate(['/merchant']);
  }
}