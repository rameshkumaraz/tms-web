import { Component, OnInit } from '@angular/core';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { Merchant } from '../model/merchant';
import { AppService } from '../shared/service/app.service';
import { JobService } from './job.service';
import { ActionEnum } from '../shared/enum/action.enum';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TriggerType } from '../shared/enum/trigger-type.enum';
import { BaseComponent } from '../shared/core/base.component';
import { first } from 'rxjs/operators';
import { ApiResponse } from '../shared/model/api.response';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent extends BaseComponent  {

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
    private modal: NgbModal,
    private toastr: ToastrService) {
      super(modal);
  }

  ngOnInit(): void {
    this.pageHeader = 'Schedule Events';
    this.mSub = this.appService.userMerchant.subscribe(data => {
      // console.log('User Merchant.....', data.id+':'+Object.keys(data).length);
      if(Object.keys(data).length > 0) {
        this.merchant = data;
        this.onPageLoad();
      }
    });
  }

  onPageLoad() {
    this.service.getByMerchant(this.merchant.id)
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

  create(content) {
    this.actionType = ActionEnum.add;
    this.openModal(content, 'md', 'Job Form');
  }

  view(id: number, content: any) {
    this.actionType = ActionEnum.view;
    this.job = this.filterJob(id)
    this.openModal(content, 'md', 'Job Form');
  }

  edit(id: number, content: any) {
    this.actionType = ActionEnum.edit;
    this.job = this.filterJob(id)
    this.openModal(content, 'md', 'Job Form');
  }

  filterJob(id: number){
    return this.jobs.find(m => m.id == id);
  }

  delete(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('Job delete success....', data);
      this.toastr.success('Event has been deleted successfully', 'Event');
      this.onPageLoad();
    },
    err => {
      console.log('Job delete error....', err);
      this.toastr.error('Unable to delete user, please contact administrator.', 'Event');
    });
  }

  ngOnDestroy(): void {
    this.mSub.remove;
  }

  public get triggerEnum(): typeof TriggerType {
    return TriggerType;
  }

}
