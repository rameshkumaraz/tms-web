import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive} from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { LocationService } from '../location/location.service';
import { Merchant } from '../model/merchant';
import { Location } from '../model/location';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { DeviceService } from './device.service';
import { ActionEnum } from '../shared/enum/action.enum';
import { ToastrService } from 'ngx-toastr';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Device } from '../model/device';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit, OnDestroy {

  faBars = faBars;
  faPlus = faPlus;
  faEye = faEye;
  faEdit = faEdit;
  faArchive = faArchive;
  faTh = faTh;

  pageHeader: string;
  page = 1;
  pageSize = 5;

  deviceCount = 0;
  devices: Array<any>;

  locations: Array<any>;
  locationCount = 0;
  locId;

  location: Location;
  device: Device;

  merchant: Merchant;

  mSub;

  actionType;

  closeResult: string;

  constructor(private appService: AppService,
    private service: DeviceService,
    private locationService: LocationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private modalService: NgbModal,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.pageHeader = 'Devices';

    // this.sub = this.activatedroute.paramMap.subscribe(params => {
    //   console.log(params);
    //   this.locId = params.get('locId');
    // });

    this.mSub = this.appService.userMerchant.subscribe(data => {
      if(Object.keys(data).length > 0) {
        this.merchant = data;
        this.onLoad();
      }
    });
  }

  onLoad() {
    this.spinner.show();
    this.locationService.getLocationsForMerchant(this.merchant.id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Location Response', resp);
          this.locations = resp.message;
          this.locationCount = this.locations.length;
          
            this.location = this.locations[0];
            this.locId = this.location.id;

          if(this.locationCount > 0)
            this.loadDeviceForLocation(this.locations[0].id);
        },
        error => {
          console.log('Location Response', error);
          this.spinner.hide();
        });
  }

  loadDeviceForLocation(id: number){
    this.service.getAllForLocation(id).pipe(first())
    .subscribe(
      (resp: ApiResponse) => {
        console.log('Device Response', resp);
        this.devices = resp.message;
        this.deviceCount = this.devices.length;
        this.spinner.hide();
      },
      error => {
        console.log('Location Response', error);
        this.spinner.hide();
      });
  }

  onLocationChange(id: number){
    this.location =  this.locations.find(x => x.id == id);
    // console.log("Selected app...", this.app);
    this.devices = [];
    this.locId = id;
    this.loadDeviceForLocation(id);
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

  create(content: any) {
    this.actionType = ActionEnum.add;
    this.openModal(content);
    // this.router.navigate(['/df', { actionType: ActionEnum.add, locId: this.locId}],{skipLocationChange: true});
  }

  view(id: number, content: any) {
    this.actionType = ActionEnum.view;
    this.device = this.filterDevice(id)
    this.openModal(content);
    // console.log("Device id...", id);
    // this.router.navigate(['/df', { actionType: ActionEnum.view, id: id}],{skipLocationChange: true});
  }

  edit(id: number, content: any) {
    this.actionType = ActionEnum.edit;
    this.device = this.filterDevice(id)
    this.openModal(content);
    // this.router.navigate(['/df', { actionType: ActionEnum.edit, id: id}],{skipLocationChange: true});
  }

  filterDevice(id: number){
    return this.devices.find(m => m.id == id);
  }

  delete(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('Library has been deleted successfully');
      this.toastr.success('Library has been deleted successfully', 'Library');
      this.onLoad();
    },
    err => {
      console.log('Device model delete error....', err);
      this.toastr.success('Unable to delete Library, please contact adminstrator', 'Library');
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
