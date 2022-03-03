import { Injectable } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserInactiveComponent } from './user-inactive/user-inactive.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  closeResult = '';

  private modal: any;

  constructor(private modalService: NgbModal) { }

  open(content, size, title) {
    // if(this.modal)
    //   this.closeAll();
    this.modal = content;
    return this.modalService.open(content, { size: size, ariaLabelledBy: title });
  }

  public getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  close(){
    this.modal.close();
  }

  closeAll(){
    console.log('Dialog Content.....', this.modal);
    this.modal = null;
    this.modalService.dismissAll();
  }
}
