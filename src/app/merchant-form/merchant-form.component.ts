import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { faCheck, faEdit, faArchive, faPlus, faUndo } from '@fortawesome/free-solid-svg-icons';
import mockData from '../../assets/config/verifone/merchant-form-config.json';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  faPlus = faPlus;
  faUndo = faUndo;

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

  terminalFormTitle = 'Add Terminal';
  terminalFormConfig: any;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal) { }

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

    this.terminalFormConfig = this.formTemplate.terminal;

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
    const formValue = this.terminalForm.value;
    let isDublicate = false;
    this.terminals.forEach(terminal => {
      if (terminal === formValue.terminal_id){
        isDublicate = true;
      }
    });
    if (!isDublicate) {
      this.terminals.push(formValue);
      this.terminalForm.reset();
    }
    console.log(this.terminals);
  }

  deleteTerminal(id: string){
    console.log('delete', id);
    for (let i = 0 ; i < this.terminals.length; i++){
      if (this.terminals[i].terminal_id === id){
        this.terminals.splice(i, 1);
      }
    }
  }

  editTerminal(id: string){
    console.log('edit', id);
    this.terminals.forEach(terminal => {
      if (terminal.terminal_id === id){
        this.terminalForm.setValue(terminal);
      }
    });
  }

  resetTerminal(){
    this.terminalForm.reset();
  }

  cancel(){
    this.router.navigate(['/merchant']);
  }

  saveMerchant(){
    const merchantValue = this.merchantForm.value;
    merchantValue.terminals = this.terminals;
    console.log('Merchant value', merchantValue);
    localStorage.setItem('draft-merchants', merchantValue);
  }


  openModal(content) {
    this.modalService.open(content, { size: 'sm' });
  }

  closeModal(content) {
    console.log('closeModel invoked', content);
    this.modalService.dismissAll();
  }
}
