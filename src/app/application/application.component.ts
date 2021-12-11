import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive} from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Merchant } from '../model/merchant';
import { ActionEnum } from '../shared/enum/action.enum';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { ApplicationService } from './application.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit, OnDestroy {

  faBars = faBars;
  faPlus = faPlus;
  faEye = faEye;
  faEdit = faEdit;
  faArchive = faArchive;
  faTh = faTh;

  pageHeader: string;
  page = 1;
  pageSize = 5;

  appCount = 0;
  apps: Array<any>;

  app: any;

  merchant: Merchant;

  mSub: Subscription;

  actionType;

  closeResult: string;

  constructor(
    private service: ApplicationService,
    private appService: AppService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toastr: ToastrService) { }
 

  ngOnInit(): void {
    this.pageHeader = 'Application';

    this.mSub = this.appService.userMerchant.subscribe(data => {
      this.merchant = data;
      this.onLoad();
    });

    
  }

  onLoad() {
    this.spinner.show();
    this.service.getAllByMerchant(this.merchant.id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Application Response', resp);
          this.apps = resp.message;
          this.appCount = this.apps.length;
          this.spinner.hide();
        },
        error => {
          console.log('Application Response', error);
          this.spinner.hide();
        });
  }

  openModal(content) {
    // this.modalService.open(content, { windowClass: 'project-modal', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    this.modalService.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  create(content: any) {
    this.actionType = ActionEnum.add;
    this.openModal(content);
    // this.router.navigate(['/df', { actionType: ActionEnum.add, locId: this.locId}],{skipLocationChange: true});
  }

  view(id: number, content: any) {
    this.actionType = ActionEnum.view;
    this.app = this.filterApp(id)
    this.openModal(content);
    // console.log("Device id...", id);
    // this.router.navigate(['/df', { actionType: ActionEnum.view, id: id}],{skipLocationChange: true});
  }

  edit(id: number, content: any) {
    this.actionType = ActionEnum.edit;
    this.app = this.filterApp(id)
    this.openModal(content);
    // this.router.navigate(['/df', { actionType: ActionEnum.edit, id: id}],{skipLocationChange: true});
  }

  filterApp(id: number){
    return this.apps.find(m => m.id == id);
  }

  delete(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('Application has been deleted successfully');
      this.toastr.success('Application has been deleted successfully', 'Application');
      this.onLoad();
    },
    err => {
      console.log('Unable to delete application....', err);
      this.toastr.success('Unable to delete application, please contact adminstrator', 'Application');
    });
  }

  closeModal(event) {
    console.log('CloseModal event received', event);
    if(event.reload)
      this.onLoad();

    this.modalService.dismissAll();
  }

  ngOnDestroy(): void {
    this.mSub.remove;
  }

}
