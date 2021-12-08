import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArchive, faBars, faEdit, faEye, faPlus, faTh } from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { Merchant } from '../model/merchant';
import { ActionEnum } from '../shared/enum/action.enum';
import { ApiResponse } from '../shared/model/api.response';
import { AppService } from '../shared/service/app.service';
import { RolesEnum } from '../utils/guards/roles.enum';
import { AuthenticationService } from '../utils/services';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  faBars = faBars;
  faPlus = faPlus;
  faEye = faEye;
  faEdit = faEdit;
  faArchive = faArchive;
  faTh = faTh;

  pageHeader: string;
  page = 1;
  pageSize = 10;

  userCount = 0;
  users: Array<any>;

  user:any;

  merchant: Merchant;

  actionType;

  closeResult: string;

  mSub;

  constructor(private userService: UserService,
    private appService: AppService,
    private authService : AuthenticationService,
    private service: UserService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.pageHeader = 'Users';
    this.mSub = this.appService.userMerchant.subscribe(data => {
      // console.log('User Merchant.....', data.id+':'+Object.keys(data).length);
      if(Object.keys(data).length > 0) {
        this.merchant = data;
        this.onLoad();
      }
    });
  }

  onLoad() {
    this.spinner.show();
    this.spinner.show();
    if(this.authService.getRole() == RolesEnum.AZ_ROOT_ADMIN) {
      this.userService.getAdminUsers()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Roles Response', resp);
          this.users = resp.message;
          this.userCount = this.users.length;
          this.spinner.hide();
        },
        err => {
          console.log('Unable to load users, please contact adminstrator', err);
          this.toastr.error('Unable to load users, please contact adminstrator', 'User');
          this.spinner.hide();
        });
    } else {
      this.userService.getUsersForMerchant(this.merchant.id)
        .pipe(first())
        .subscribe(
          (resp: ApiResponse) => {
            console.log('Users Response', resp);
            this.users = resp.message;
            this.userCount = this.users.length;
            this.spinner.hide();
          },
          err => {
            console.log('Unable to load users, please contact adminstrator', err);
            this.toastr.error('Unable to users roles, please contact adminstrator', 'User');
            this.spinner.hide();
          });
      }
    
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

  createUser(content:any) {
    this.actionType = ActionEnum.add;
    this.openModal(content);
  }

  viewUser(id: number, content:any) {
    this.actionType = ActionEnum.view;
    this.user = this.filterUser(id)
    this.openModal(content);
  }

  editUser(id: number, content:any) {
    this.actionType = ActionEnum.edit;
    this.user = this.filterUser(id)
    this.openModal(content);
  }

  filterUser(id: number){
    return this.users.find(m => m.id == id);
  }

  deleteUser(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('User delete success....', data);
      this.toastr.success('User has been deleted successfully', 'User');
      this.onLoad();
    },
    err => {
      console.log('User delete error....', err);
      this.toastr.error('Unable to delete user, please contact administrator.', 'User');
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
