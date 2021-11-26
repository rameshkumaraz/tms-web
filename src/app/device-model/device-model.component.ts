import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive} from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { DeviceModel } from '../model/device-model';
import { ActionEnum } from '../shared/enum/action.enum';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { DeviceModelService } from './device-model.service';

@Component({
  selector: 'app-device-model',
  templateUrl: './device-model.component.html',
  styleUrls: ['./device-model.component.scss']
})
export class DeviceModelComponent implements OnInit {

  faBars = faBars;
  faPlus = faPlus;
  faEye = faEye;
  faEdit = faEdit;
  faArchive = faArchive;
  faTh = faTh;

  pageHeader: string;
  page = 1;
  pageSize = 5;

  modelCount = 0;
  models: Array<any>;

  constructor(
    private service: DeviceModelService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.pageHeader = 'Device Model';
    this.onLoad();
  }

  onLoad() {
    this.spinner.show();
    this.service.getAll()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Brand Response', resp);
          this.models = resp.message;
          this.modelCount = this.models.length;
          this.spinner.hide();
        },
        error => {
          console.log('Location Response', error);
          this.spinner.hide();
        });
  }

  create() {
    this.router.navigate(['/dmf', { actionType: ActionEnum.add}],{skipLocationChange: true});
  }

  view(id: number) {
    this.router.navigate(['/dmf', { actionType: ActionEnum.view, id: id}],{skipLocationChange: true});
  }

  edit(id: number) {
    this.router.navigate(['/dmf', { actionType: ActionEnum.edit, id: id}],{skipLocationChange: true});
  }

  delete(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('Model has been deleted successfully');
      this.toastr.success('Model has been deleted successfully', 'Device Model');
      this.router.navigate(['/dmf']);
    },
    err => {
      console.log('Device model delete error....', err);
      this.toastr.error('Unable to delete model, please contact adminstrator', 'Device Model');
    });
  }

}
