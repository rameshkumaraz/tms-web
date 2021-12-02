import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive} from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ActionEnum } from '../shared/enum/action.enum';
import { ApiResponse } from '../shared/model/api.response';
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

  brand: any;

  actionType;

  closeResult: string;

  constructor(
    private service: DeviceBrandService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private modalService: NgbModal,
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
    // console.log('Add new brand');
    // this.router.navigate(['/dbf', { actionType: ActionEnum.add}],{skipLocationChange: true});
  }

  view(id: number, content:any) {
    this.actionType = ActionEnum.view;
    this.brand = this.filterBrand(id)
    this.openModal(content);
    // this.router.navigate(['/dbf', { actionType: ActionEnum.view, id: id}],{skipLocationChange: true});
  }

  edit(id: number, content:any) {
    this.actionType = ActionEnum.edit;
    this.brand = this.filterBrand(id)
    this.openModal(content);
    // this.router.navigate(['/dbf', { actionType: ActionEnum.edit, id: id}],{skipLocationChange: true});
  }

  filterBrand(id: number){
    return this.brands.find(m => m.id == id);
  }

  delete(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('Brand has been deleted successfully');
      this.toastr.success('Brand has been deleted successfully', 'Device Brand');
      //this.router.navigate(['/dbrand']);
      this.onLoad();
    },
    err => {
      console.log('Device model delete error....', err);
      this.toastr.success('Unable to delete brand, please contact adminstrator', 'Device Brand');
    });
  }

  closeModal(event) {
    console.log('CloseModal event received', event);
    if(event.reload)
      this.onLoad()

    this.modalService.dismissAll();
  }
}
