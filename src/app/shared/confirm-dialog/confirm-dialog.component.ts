import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  @Input() resource;
  @Output() modalClosed = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  confirmAction(){
    this.modalClosed.emit(true);
  }

  cancelAction() {
    this.modalClosed.emit(false);
  }

}
