import { Component, Input, OnInit } from '@angular/core';
import { faUser, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/utils/services';
import { LoginNotificationService } from '../service/login-notification.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() opened: string;

  profile: any;

  faUser = faUser;
  faSignIn = faSignInAlt;
  faSignOut = faSignOutAlt;

  hasDbAccess = false;
  hasMDbAccess = false;
  hasMerchantAccess = false;
  hasLocationAccess = false;
  hasDeviceAccess = false;
  hasReportAccess = false;
  hasAdminAccess = false;
  hasMReportAccess = false;
  hasRoleAccess = false;

  constructor(config: NgbModalConfig, private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private loginNotifyService: LoginNotificationService,
    private router: Router) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.profile = this.authenticationService.getCurrentUser();
    // console.log(this.profile);
    this.loginNotifyService.events$.pipe(first())
    .subscribe(
      resp => {
        this.profile = resp;
      });

    this.populateAccess();  
  }

  populateAccess(){
    console.log('Role...', this.profile.roleName);
    console.log('Role...', ["AZ_ROOT_ADMIN", "AZ_ADMIN"].indexOf(this.profile.roleName));
    if(["AZ_ROOT_ADMIN", "AZ_ADMIN"].indexOf(this.profile.roleName) >= 0){
      this.hasDbAccess = true;
      this.hasMerchantAccess = true;
      this.hasMReportAccess = true;
      this.hasReportAccess = true;
      this.hasRoleAccess = true;
    }
    if(["AZ_ROOT_ADMIN", "MERCHANT_ADMIN"].indexOf(this.profile.roleName) >= 0){ 
      this.hasMDbAccess = true;
      this.hasAdminAccess = true;
      this.hasReportAccess = true;
    }

    if(["AZ_ROOT_ADMIN", "MERCHANT_ADMIN", "MERCHANT_SUPERVISOR", "MERCHANT_USER"].indexOf(this.profile.roleName) >= 0){ 
      this.hasLocationAccess = true;
      this.hasDeviceAccess = true;
    }
  }

  openModal(content) {
    this.modalService.open(content, { size: 'md' });
  }

  openLoginModal(content) {
    this.modalService.open(content, { size: 'sm' });
  }

  closeModal(content, type) {
    console.log('closeModel invoked', content);
    this.modalService.dismissAll();
  }

  logout() {
    this.authenticationService.logout();
    this.profile = null;
    this.router.navigate(['/login']);
  }
}
