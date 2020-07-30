import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormField } from '../model/form.field';
import { FormGroup, FormControl } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  @Input() formTitle: string;
  @Input() formConfig: any;
  @Input() addMore: boolean;

  @Output() modelClosed = new EventEmitter();

  faTimes = faTimes;

  formGroup: FormGroup;
  submitted = false;
  isFailed = false;
  errMsg: string;

  constructor() { }

  ngOnInit(): void {
    const formControls = {};
    console.log(this.formConfig.fields);
    this.formConfig.fields.rows.forEach(row => {
      row.cols.forEach(control => {
        console.log('Field name', control.name);
        formControls[control.name] = new FormControl('');
      });
    });
    this.formGroup = new FormGroup(formControls);
  }

  reset(){

  }

  save(){

  }

  saveMore(){

  }

  cancel() {

  }

  close() {
    this.modelClosed.emit(true);
  }

}
