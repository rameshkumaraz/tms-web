import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive} from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ActionEnum } from '../shared/enum/action.enum';
import { ApiResponse } from '../shared/model/api.response';
import { ApplicationService } from './application.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

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

  constructor(
    private service: ApplicationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.pageHeader = 'Application';
    this.onLoad();
  }

  onLoad() {
    this.spinner.show();
    this.service.getAll()
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

  create() {
    console.log('Add new Application');
    this.router.navigate(['/af', { actionType: ActionEnum.add}],{skipLocationChange: true});
  }

  view(id: number) {
    this.router.navigate(['/af', { actionType: ActionEnum.view, id: id}],{skipLocationChange: true});
  }

  edit(id: number) {
    this.router.navigate(['/af', { actionType: ActionEnum.edit, id: id}],{skipLocationChange: true});
  }

  delete(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('Application has been deleted successfully');
      this.toastr.success('Application has been deleted successfully', 'Application');
      this.router.navigate(['/application']);
    },
    err => {
      console.log('Device model delete error....', err);
      this.toastr.success('Unable to delete application, please contact adminstrator', 'Application');
    });
  }

}
