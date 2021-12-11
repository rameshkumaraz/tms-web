import { Component, OnInit } from '@angular/core';
import { faArchive, faBars, faEdit, faEye, faPlus, faTh } from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Merchant } from '../model/merchant';
import { ActionEnum } from '../shared/enum/action.enum';
import { AppService } from '../shared/service/app.service';
import { AppParamService } from './app-param.service';
import mockData from '../../assets/config/azpay-app-config.json';

@Component({
  selector: 'app-app-param',
  templateUrl: './app-param.component.html',
  styleUrls: ['./app-param.component.scss']
})
export class AppParamComponent implements OnInit {

  faBars = faBars;
  faPlus = faPlus;
  faEye = faEye;
  faEdit = faEdit;
  faArchive = faArchive;
  faTh = faTh;

  pageHeader: string;
  page = 1;
  pageSize = 5;

  appParamCount = 0;
  appParams: Array<any>;

  appParam: any;

  merchant: Merchant;

  mSub: Subscription;

  actionType;

  closeResult: string;

  formTitle: any;
  formConfig: any;

  constructor(
    private service: AppParamService,
    private appService: AppService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toastr: ToastrService) { }
 

  ngOnInit(): void {
    this.pageHeader = 'Parameter Configuration';

    this.formConfig = mockData;

    this.mSub = this.appService.userMerchant.subscribe(data => {
      this.merchant = data;
      this.onLoad();
    });

    
  }

  onLoad() {
    // this.spinner.show();
    // this.service.getAllByMerchant(this.merchant.id)
    //   .pipe(first())
    //   .subscribe(
    //     (resp: ApiResponse) => {
    //       console.log('Application Response', resp);
    //       this.apps = resp.message;
    //       this.appCount = this.apps.length;
    //       this.spinner.hide();
    //     },
    //     error => {
    //       console.log('Application Response', error);
    //       this.spinner.hide();
    //     });
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
    // this.actionType = ActionEnum.add;
    this.openModal(content);
  }

  view(id: number, content: any) {
    // this.actionType = ActionEnum.view;
    // this.app = this.filterApp(id)
    // this.openModal(content);
  }

  edit(id: number, content: any) {
    // this.actionType = ActionEnum.edit;
    // this.app = this.filterApp(id)
    // this.openModal(content);
  }

  // filterApp(id: number){
  //   return this.apps.find(m => m.id == id);
  // }

  delete(id: number) {
    // this.service.delete(id).subscribe(data => {
    //   console.log('Application has been deleted successfully');
    //   this.toastr.success('Application has been deleted successfully', 'Application');
    //   this.onLoad();
    // },
    // err => {
    //   console.log('Device model delete error....', err);
    //   this.toastr.success('Unable to delete application, please contact adminstrator', 'Application');
    // });
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
