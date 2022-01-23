import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive } from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
    private modal: NgbModal,
    private toastr: ToastrService) {
    super(modal);
  }

  ngOnInit(): void {
    this.pageHeader = 'Application Bundle';
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
      console.log('Library has been deleted successfully');
      this.toastr.success('Library has been deleted successfully', 'Library');
      this.loadLibraries();
    },
      err => {
        console.log('Device model delete error....', err);
        this.toastr.success('Unable to delete Library, please contact adminstrator', 'Library');
      });
  }

  ngOnDestroy(): void {
    this.mSub.remove;
  }
}
