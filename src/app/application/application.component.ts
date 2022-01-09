import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive } from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Merchant } from '../model/merchant';
import { BaseComponent } from '../shared/core/base.component';
import { ActionEnum } from '../shared/enum/action.enum';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { ApplicationService } from './application.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent extends BaseComponent {

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
    private modal: NgbModal,
    private toastr: ToastrService) {
    super(modal);
  }

  ngOnInit(): void {
    this.pageHeader = 'Application';

    this.mSub = this.appService.userMerchant.subscribe(data => {
      this.merchant = data;
      this.onPageLoad();
    });


  }

  onPageLoad() {
    this.spinner.show();
    this.service.getByMerchant(this.merchant.id)
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

  create(content: any) {
    this.actionType = ActionEnum.add;
    this.openModal(content, 'md', 'App Form');
  }

  view(id: number, content: any) {
    this.actionType = ActionEnum.view;
    this.app = this.filterApp(id)
    this.openModal(content, 'md', 'App Form');
  }

  edit(id: number, content: any) {
    this.actionType = ActionEnum.edit;
    this.app = this.filterApp(id)
    this.openModal(content, 'md', 'App Form');
  }

  filterApp(id: number) {
    return this.apps.find(m => m.id == id);
  }

  delete(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('Application has been deleted successfully');
      this.toastr.success('Application has been deleted successfully', 'Application');
      this.onPageLoad();
    },
      err => {
        console.log('Unable to delete application....', err);
        this.toastr.success('Unable to delete application, please contact adminstrator', 'Application');
      });
  }

}
