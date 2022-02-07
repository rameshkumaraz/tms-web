import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive } from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ModuleBody } from 'typescript';
import { DeviceModel } from '../model/device-model';
import { BaseComponent } from '../shared/core/base.component';
import { ActionEnum } from '../shared/enum/action.enum';
import { ApiResponse } from '../shared/model/api.response';
import { DeviceModelService } from './device-model.service';

@Component({
  selector: 'app-device-model',
  templateUrl: './device-model.component.html',
  styleUrls: ['./device-model.component.scss']
})
export class DeviceModelComponent extends BaseComponent {

  pageHeader: string;
  page = 1;
  pageSize = 10;

  brands: Array<any>;

  modelCount = 0;
  models: Array<any>;

  model: DeviceModel;

  actionType;

  closeResult: string;

  constructor(
    private service: DeviceModelService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modal: NgbModal) {
    super(modal);
  }

  ngOnInit(): void {
    this.pageHeader = 'Device Model';
    this.onPageLoad();
  }

  onPageLoad() {
    this.spinner.show();
    this.service.getAll()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Device Model Response', resp);
          this.models = resp.message;
          this.modelCount = this.models.length;
          this.spinner.hide();
        },
        error => {
          console.log('Device Model Response', error);
          this.spinner.hide();
        });
  }

  create(content: any) {
    this.actionType = ActionEnum.add;
    this.openModal(content, 'md', 'Device Model');
  }

  view(id: number, content: any) {
    this.actionType = ActionEnum.view;
    this.model = this.filterModel(id)
    this.openModal(content, 'md', 'Device Model');
  }

  edit(id: number, content: any) {
    this.actionType = ActionEnum.edit;
    this.model = this.filterModel(id)
    this.openModal(content, 'md', 'Device Model');
  }

  filterModel(id: number) {
    return this.models.find(m => m.id == id);
  }

  delete(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('Model has been deleted successfully');
      this.toastr.success('Model has been deleted successfully', 'Device Model');
      this.onPageLoad();
    },
      err => {
        console.log('Device model delete error....', err);
        this.toastr.error('Unable to delete model, please contact adminstrator', 'Device Model');
      });
  }
}