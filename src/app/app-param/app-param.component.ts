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
import { BaseComponent } from '../shared/core/base.component';
import { ApplicationService } from '../application/application.service';
import { first } from 'rxjs/operators';
import { ApiResponse } from '../shared/model/api.response';

@Component({
  selector: 'app-app-param',
  templateUrl: './app-param.component.html',
  styleUrls: ['./app-param.component.scss']
})
export class AppParamComponent extends BaseComponent {

  pageHeader: string;
  page = 1;
  pageSize = 5;

  appParamCount = 0;
  appParams: Array<any>;

  appParam: any;

  apps: Array<any>;
  appsCount = 0;
  app: any;

  merchant: Merchant;

  mSub: Subscription;

  actionType;

  closeResult: string;

  formTitle: any;
  formConfig: any;

  dynamicFormValue: any;

  constructor(
    public paramService: AppParamService,
    private appService: AppService,
    private applicationService: ApplicationService,
    private spinner: NgxSpinnerService,
    private modal: NgbModal,
    private toastr: ToastrService) {
    super(modal);
  }

  ngOnInit(): void {
    this.pageHeader = 'Parameter Configuration';

    this.formConfig = mockData;

    this.mSub = this.appService.userMerchant.subscribe(data => {
      this.merchant = data;
      this.onPageLoad();
    });

    console.log("Selected app.....", this.app);
  }

  onPageLoad() {
    this.spinner.show();
    this.applicationService.getByMerchant(this.merchant.id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Application Response', resp);
          this.apps = resp.message;
          this.appsCount = this.apps.length;
          this.spinner.hide();
        },
        error => {
          console.log('Application Response', error);
          this.spinner.hide();
        });
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

  create(appId: number, content: any) {
    this.actionType = ActionEnum.add;
    this.app = this.filterApp(appId);
    this.openModal(content, 'md', 'Parameter Form');
    this.paramService.setRelation(this.merchant.id, this.app.id);
    console.log('Relation.....', this.paramService.setRelation);
  }

  view(id: number, content: any) {
    this.actionType = ActionEnum.view;
    this.app = this.filterApp(id)
    this.openModal(content, 'md', 'Parameter Form');
  }

  edit(id: number, content: any) {
    this.actionType = ActionEnum.edit;
    this.app = this.filterApp(id)
    this.openModal(content, 'md', 'Parameter Form');
    this.paramService.setRelation(this.merchant.id, this.app.id);
    console.log('Relation.....', this.paramService.getRelation());
  }

  filterApp(id: number) {
    return this.apps.find(m => m.id == id);
  }

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

  ngOnDestroy(): void {
    this.mSub.remove;
  }
}
