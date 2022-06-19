import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ApplicationService } from '../application/application.service';
import { Application } from '../model/application';
import { Library } from '../model/library';
import { Merchant } from '../model/merchant';
import { BaseComponent } from '../shared/core/base.component';
import { ActionEnum } from '../shared/enum/action.enum';
import { PostActionEnum } from '../shared/enum/post-action.enum';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { LibraryService } from './library.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent extends BaseComponent {

  pageHeader: string;
  page = 1;
  pageSize = 5;

  libCount = 0;
  libs: Array<Library>;
  apps: Array<Application>;
  appCount = 0;

  app: any;
  lib: any;

  appId;

  merchant: Merchant;

  mSub;

  actionType;

  closeResult: string;

  constructor(
    private service: LibraryService,
    private appService: AppService,
    private aplnService: ApplicationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {
    this.pageHeader = 'Application Version';

    this.loadActionAccess(this.componentEnum.appBuild.toString());

    this.mSub = this.appService.userMerchant.subscribe(data => {
      this.merchant = data;
      this.onPageLoad();
    });
  }

  onPageLoad() {
    this.spinner.show();
    this.aplnService.getByMerchant(this.merchant.id).subscribe((resp: ApiResponse) => {
      //this.spinner.hide();
      this.apps = resp.message;
      this.appCount = this.apps.length;
      // console.log('Selected App....', this.appId);
      // if(this.appId)
      //   this.app = this.apps.find(a => a.id == this.appId);
      // else   
      //   this.app = this.apps[0];
      // console.log('apps count...', this.appCount);
      if (this.appCount > 0)
        this.loadLibraries();
      else
        this.spinner.hide();
    },
      err => {
        console.log('Unable to load applications, please contact adminstrator', err);
        this.toastr.error('Unable to load applications, please contact adminstrator', "Library");
        this.spinner.hide();
      });
  }

  loadLibraries() {
    this.service.findForMerchant(this.merchant.id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          this.libs = resp.message;
          // console.log('Libraries', this.libs);
          this.libCount = this.libs.length;
          this.spinner.hide();
        },
        error => {
          console.log('Library Response', error);
          this.spinner.hide();
        });
  }

  // changeApp(id: number) {
  //   // console.log("Selected app id...", id +':' + JSON.stringify(this.apps));
  //   this.app = this.apps.find(x => x.id == id);
  //   // console.log("Selected app...", this.app);
  //   this.libs = [];
  //   this.loadLibraries();
  // }

  create(content: any) {
    this.actionType = ActionEnum.add;
    this.openModal(content, 'md', 'Library Form');
  }

  view(id: number, content: any) {
    this.actionType = ActionEnum.view;
    this.lib = this.filterLib(id)
    this.openModal(content, 'md', 'Library Form');
  }

  edit(id: number, content: any) {
    this.actionType = ActionEnum.edit;
    this.lib = this.filterLib(id)
    this.openModal(content, 'md', 'Library Form');
  }

  filterLib(id: number) {
    return this.libs.find(m => m.id == id);
  }

  getPostActionDetails(postAction: string, delay: number) {
    if (postAction === PostActionEnum.NONE)
      return postAction;
    else
      return postAction + ' (' + delay + ')';
  }

  delete(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('Application version has been deleted successfully');
      this.toastr.success('Application Version has been deleted successfully', 'Application Version');
      this.loadLibraries();
    },
      err => {
        console.log('Application version delete error....', err);
        this.toastr.success('Unable to delete application version, please contact adminstrator', 'Application Version');
      });
  }

  updateStatus(id: number, status: number) {
    this.spinner.show();
    let model = Object.assign({}, this.filterLib(id));
    model.status = status;
    this.service.updateStatus(id, model).subscribe(data => {
      console.log('Application version status has been updated successfully');
      this.toastr.success('Application version status has been updated successfully', 'Application Version');
      this.onPageLoad();
      this.spinner.hide();
    },
      err => {
        console.log('Unable to update application version status....', err);
        this.toastr.error('Unable to update application version status, please contact adminstrator', 'Application Version');
        this.spinner.hide();
      });
  }

  ngOnDestroy(): void {
    this.mSub.remove;
  }
}
