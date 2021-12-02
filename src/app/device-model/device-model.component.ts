import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive} from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ModuleBody } from 'typescript';
import { DeviceModel } from '../model/device-model';
import { ActionEnum } from '../shared/enum/action.enum';
import { ApiResponse } from '../shared/model/api.response';
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

  brands: Array<any>;

  modelCount = 0;
  models: Array<any>;

  model: DeviceModel;

  actionType;

  closeResult: string;

  constructor(
    private service: DeviceModelService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal) { }

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

  openModal(content) {
    // this.modalService.open(content, { windowClass: 'project-modal', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    this.modalService.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  create(content:any) {
    this.actionType = ActionEnum.add;
    this.openModal(content);
    // this.router.navigate(['/dmf', { actionType: ActionEnum.add}],{skipLocationChange: true});
  }

  view(id: number, content:any) {
    this.actionType = ActionEnum.view;
    this.model = this.filterModel(id)
    this.openModal(content);
    // this.router.navigate(['/dmf', { actionType: ActionEnum.view, id: id}],{skipLocationChange: true});
  }

  edit(id: number, content:any) {
    this.actionType = ActionEnum.edit;
    this.model = this.filterModel(id)
    this.openModal(content);
    // this.router.navigate(['/dmf', { actionType: ActionEnum.edit, id: id}],{skipLocationChange: true});
  }

  filterModel(id: number){
    return this.models.find(m => m.id == id);
  }

  delete(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('Model has been deleted successfully');
      this.toastr.success('Model has been deleted successfully', 'Device Model');
      this.router.navigate(['/dmodel']);
    },
    err => {
      console.log('Device model delete error....', err);
      this.toastr.error('Unable to delete model, please contact adminstrator', 'Device Model');
    });
  }

  closeModal(content) {
    console.log('CloseModal event received');
    this.modalService.dismissAll();
  }
}