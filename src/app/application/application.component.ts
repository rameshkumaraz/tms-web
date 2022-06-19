import { Component} from '@angular/core';
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
    private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {
    this.pageHeader = 'Application';

    this.loadActionAccess(this.componentEnum.app.toString());

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

  updateStatus(id: number, status: number) {
    this.spinner.show();
    let model = Object.assign({}, this.filterApp(id));
    model.status = status;
    this.service.updateStatus(id, model).subscribe(data => {
      console.log('Application status has been updated successfully');
      this.toastr.success('Application status has been updated successfully', 'Application');
      this.onPageLoad();
      this.spinner.hide();
    },
      err => {
        console.log('Unable to update application status....', err);
        this.toastr.error('Unable to update application status, please contact adminstrator', 'Application');
        this.spinner.hide();
      });
  }

}
