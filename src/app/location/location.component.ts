import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { Merchant } from '../model/merchant';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { LocationService } from './location.service';
import { ActionEnum } from '../shared/enum/action.enum';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit, OnDestroy {

  faBars = faBars;
  faPlus = faPlus;
  faEye = faEye;
  faEdit = faEdit;
  faArchive = faArchive;
  faTh = faTh;

  pageHeader: string;
  page = 1;
  pageSize = 10;

  locationCount = 0;
  locations: Array<any>;

  location: any
  
  merchant: Merchant;

  actionType;

  closeResult: string;

  mSub;

  constructor(private locationService: LocationService,
    private appService: AppService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private router: Router) {
  }

  ngOnInit(): void {
    this.pageHeader = 'Location';
    this.mSub = this.appService.userMerchant.subscribe(data => {
      // console.log('User Merchant.....', data.id+':'+Object.keys(data).length);
      if(Object.keys(data).length > 0) {
        this.merchant = data;
        this.onLoad();
      }
    });
    // this.onLoad();
  }

  onLoad() {
    
    this.locationService.getLocationsForMerchant(this.merchant.id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Location Response', resp);
          this.locations = resp.message;
          this.locationCount = this.locations.length;
          this.spinner.hide();
        },
        error => {
          console.log('Location Response', error);
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

  create(content) {
    this.actionType = ActionEnum.add;
    this.openModal(content);
    // this.router.navigate(['/lf', { actionType: ActionEnum.add, id: this.merchant.id }],{skipLocationChange: true});
  }

  view(id: number, content: any) {
    this.actionType = ActionEnum.view;
    this.location = this.filterLocation(id)
    this.openModal(content);
    // this.router.navigate(['/lf', { actionType: ActionEnum.view, id: id}],{skipLocationChange: true});
  }

  edit(id: number, content: any) {
    this.actionType = ActionEnum.edit;
    this.location = this.filterLocation(id)
    this.openModal(content);
    // this.router.navigate(['/lf', { actionType: ActionEnum.edit, id: id}],{skipLocationChange: true});
  }

  filterLocation(id: number){
    return this.locations.find(m => m.id == id);
  }

  delete(id: number) {
    this.locationService.deleteLocation(id).subscribe(data => {
      console.log('Location delete success....', data);
      this.onLoad();
    },
    err => {
      console.log('Location delete error....', err);
    });
  }

  closeModal(event) {
    console.log('CloseModal event received', event);
    if(event.reload)
      this.onLoad();

    this.modalService.dismissAll();
  }

  ngOnDestroy(): void {
    this.mSub.remove;
  }

}
