import { Component, OnInit } from '@angular/core';
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

  profile: User;

  faUser = faUser;
  faSignIn = faSignInAlt;
  faSignOut = faSignOutAlt;

  constructor(config: NgbModalConfig, private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private loginNotifyService: LoginNotificationService,
    private router: Router) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.profile = JSON.parse(sessionStorage.getItem('currentUser'));
    // console.log(this.profile);
    this.loginNotifyService.events$.pipe(first())
    .subscribe(
      resp => {
        this.profile = resp;
      });
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
