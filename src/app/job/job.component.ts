import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { Merchant } from '../model/merchant';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { JobService } from './job.service';
import { ActionEnum } from '../shared/enum/action.enum';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TriggerType } from '../shared/enum/trigger-type.enum';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {

  faBars = faBars;
  faPlus = faPlus;
  faEye = faEye;
  faEdit = faEdit;
  faArchive = faArchive;
  faTh = faTh;

  pageHeader: string;
  page = 1;
  pageSize = 10;

  jobCount = 0;
  jobs: Array<any>;

  job: any
  
  merchant: Merchant;

  actionType;

  closeResult: string;

  mSub;

  constructor(private service: JobService,
    private appService: AppService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.pageHeader = 'Schedule Events';
    this.mSub = this.appService.userMerchant.subscribe(data => {
      // console.log('User Merchant.....', data.id+':'+Object.keys(data).length);
      if(Object.keys(data).length > 0) {
        this.merchant = data;
        this.onLoad();
      }
    });
    // this.onLoad();
  }

  onLoad() {
    
    this.service.getAllForMerchant(this.merchant.id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Jobs Response', resp);
          this.jobs = resp.message;
          this.jobCount = this.jobs.length;
          this.spinner.hide();
        },
        error => {
          console.log('Jobs Response', error);
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

  create(content) {
    this.actionType = ActionEnum.add;
    this.openModal(content);
    // this.router.navigate(['/lf', { actionType: ActionEnum.add, id: this.merchant.id }],{skipLocationChange: true});
  }

  view(id: number, content: any) {
    this.actionType = ActionEnum.view;
    this.job = this.filterJob(id)
    this.openModal(content);
    // this.router.navigate(['/lf', { actionType: ActionEnum.view, id: id}],{skipLocationChange: true});
  }

  edit(id: number, content: any) {
    this.actionType = ActionEnum.edit;
    this.job = this.filterJob(id)
    this.openModal(content);
    // this.router.navigate(['/lf', { actionType: ActionEnum.edit, id: id}],{skipLocationChange: true});
  }

  filterJob(id: number){
    return this.jobs.find(m => m.id == id);
  }

  delete(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('Job delete success....', data);
      this.toastr.success('Event has been deleted successfully', 'Event');
      this.onLoad();
    },
    err => {
      console.log('Job delete error....', err);
      this.toastr.error('Unable to delete user, please contact administrator.', 'Event');
    });
  }

  // enaleEdit(date : string): boolean{

  // }

  closeModal(event) {
    console.log('CloseModal event received', event);
    if(event.reload)
      this.onLoad();

    this.modalService.dismissAll();
  }

  ngOnDestroy(): void {
    this.mSub.remove;
  }

  public get triggerEnum(): typeof TriggerType {
    return TriggerType;
  }

}
