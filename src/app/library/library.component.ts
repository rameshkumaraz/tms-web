import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive} from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ApplicationService } from '../application/application.service';
import { Application } from '../model/application';
import { Library } from '../model/library';
import { Merchant } from '../model/merchant';
import { ActionEnum } from '../shared/enum/action.enum';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { LibraryService } from './library.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

  faBars = faBars;
  faPlus = faPlus;
  faEye = faEye;
  faEdit = faEdit;
  faArchive = faArchive;
  faTh = faTh;

  pageHeader: string;
  page = 1;
  pageSize = 5;

  libCount = 0;
  libs: Array<Library>;
  apps: Array<Application>;
  appCount = 0;

  app: Application;

  appId;

  merchant: Merchant;

  sub;

  constructor(
    private service: LibraryService,
    private appService: AppService,
    private aplnService: ApplicationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.pageHeader = 'Library';

    this.sub = this.activatedroute.paramMap.subscribe(params => {
      console.log(params);
      this.appId = params.get('appId');
    });

    this.appService.userMerchant.subscribe(data => {
      this.merchant = data;
      this.loadApps();
    });

    // this.onLoad();
  }

  loadApps(){
    this.spinner.show();
    this.aplnService.getAllByMerchant(this.merchant.id).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.apps = resp.message;
      this.appCount = this.apps.length;
      // console.log('Selected App....', this.appId);
      if(this.appId)
        this.app = this.apps.find(a => a.id == this.appId);
      else   
        this.app = this.apps[0];
      // console.log('apps count...', this.appCount);
      if(this.appCount > 0)
        this.loadLibraries();
    },
      err => {
        console.log('Unable to load applications, please contact adminstrator', err);
        this.toastr.error('Unable to load applications, please contact adminstrator', "Library");
        this.spinner.hide();
      });
  }

  loadLibraries() {
    this.spinner.show();
    this.service.getAllForApplication(this.app.id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          // console.log('Library Response for ', this.app.name+' : '+JSON.stringify(resp));
          this.libs = resp.message;
          // console.log('Libraries', this.libs);
          this.libCount = this.libs.length;
          // console.log('Library Count', this.libCount);
          this.spinner.hide();
        },
        error => {
          console.log('Library Response', error);
          this.spinner.hide();
        });
  }

  changeApp(id: number){
    // console.log("Selected app id...", id +':' + JSON.stringify(this.apps));
    this.app =  this.apps.find(x => x.id == id);
    // console.log("Selected app...", this.app);
    this.libs = [];
    this.loadLibraries();
  }

  create() {
    console.log('Add new Library');
    this.router.navigate(['/libf', { actionType: ActionEnum.add}],{skipLocationChange: true});
  }

  view(id: number) {
    this.router.navigate(['/libf', { actionType: ActionEnum.view, id: id}],{skipLocationChange: true});
  }

  edit(id: number) {
    this.router.navigate(['/libf', { actionType: ActionEnum.edit, id: id}],{skipLocationChange: true});
  }

  delete(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('Library has been deleted successfully');
      this.toastr.success('Library has been deleted successfully', 'Library');
      this.router.navigate(['/library']);
    },
    err => {
      console.log('Device model delete error....', err);
      this.toastr.success('Unable to delete Library, please contact adminstrator', 'Library');
    });
  }

}
