import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive} from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ActionEnum } from '../shared/enum/action.enum';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { DeviceBrandService } from './device-brand.service';

@Component({
  selector: 'app-device-brand',
  templateUrl: './device-brand.component.html',
  styleUrls: ['./device-brand.component.scss']
})
export class DeviceBrandComponent implements OnInit {

  faBars = faBars;
  faPlus = faPlus;
  faEye = faEye;
  faEdit = faEdit;
  faArchive = faArchive;
  faTh = faTh;

  pageHeader: string;
  page = 1;
  pageSize = 5;

  brandCount = 0;
  brands: Array<any>;

  constructor(
    private service: DeviceBrandService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.pageHeader = 'Device Brand';
    this.onLoad();
  }

  onLoad() {
    this.spinner.show();
    this.service.getAll()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Brand Response', resp);
          this.brands = resp.message;
          this.brandCount = this.brands.length;
          this.spinner.hide();
        },
        error => {
          console.log('Location Response', error);
          this.spinner.hide();
        });
  }

  create() {
    console.log('Add new brand');
    this.router.navigate(['/dbf', { actionType: ActionEnum.add}],{skipLocationChange: true});
  }

  view(id: number) {
    this.router.navigate(['/dbf', { actionType: ActionEnum.view, id: id}],{skipLocationChange: true});
  }

  edit(id: number) {
    this.router.navigate(['/dbf', { actionType: ActionEnum.edit, id: id}],{skipLocationChange: true});
  }

  delete(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('Brand has been deleted successfully');
      this.toastr.success('Brand has been deleted successfully', 'Device Brand');
      this.router.navigate(['/dbrand']);
    },
    err => {
      console.log('Device model delete error....', err);
      this.toastr.success('Unable to delete brand, please contact adminstrator', 'Device Brand');
    });
  }
}
