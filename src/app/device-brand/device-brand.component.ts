import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../shared/core/base.component';
import { ActionEnum } from '../shared/enum/action.enum';
import { ApiResponse } from '../shared/model/api.response';
import { DeviceBrandService } from './device-brand.service';

@Component({
  selector: 'app-device-brand',
  templateUrl: './device-brand.component.html',
  styleUrls: ['./device-brand.component.scss']
})
export class DeviceBrandComponent extends BaseComponent {

  pageHeader: string;
  page = 1;
  pageSize = 10;

  brandCount = 0;
  brands: Array<any>;

  brand: any;

  actionType;

  closeResult: string;

  constructor(
    private service: DeviceBrandService,
    private spinner: NgxSpinnerService,
    private modal: NgbModal,
    private toastr: ToastrService) {
    super(modal);
  }

  ngOnInit(): void {
    this.pageHeader = 'Device Brand';
    this.onPageLoad();
  }

  onPageLoad() {
    this.spinner.show();
    this.service.getAll()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Device Brand Response', resp);
          this.brands = resp.message;
          this.brandCount = this.brands.length;
          this.spinner.hide();
        },
        error => {
          console.log('Device Brand Response', error);
          this.spinner.hide();
        });
  }

  create(content: any) {
    this.actionType = ActionEnum.add;
    this.openModal(content, 'md', 'Device Brand Form');
  }

  view(id: number, content: any) {
    this.actionType = ActionEnum.view;
    this.brand = this.filterBrand(id)
    this.openModal(content, 'md', 'Device Brand Form');
  }

  edit(id: number, content: any) {
    this.actionType = ActionEnum.edit;
    this.brand = this.filterBrand(id)
    this.openModal(content, 'md', 'Device Brand Form');
  }

  filterBrand(id: number) {
    return this.brands.find(m => m.id == id);
  }

  delete(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('Brand has been deleted successfully');
      this.toastr.success('Brand has been deleted successfully', 'Device Brand');
      this.onPageLoad();
    },
      err => {
        console.log('Device model delete error....', err);
        this.toastr.success('Unable to delete brand, please contact adminstrator', 'Device Brand');
      });
  }
}
