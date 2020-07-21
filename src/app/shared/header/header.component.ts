import { Component, OnInit } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/utils/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  profile: User;

  faUser = faUser;

  constructor(config: NgbModalConfig, private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private router: Router) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.profile = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log(this.profile);
  }

  open(content) {
    this.modalService.open(content, { size: 'md' });
  }

  openLogin(content) {
    this.modalService.open(content, { size: 'sm' });
  }

  close() {
    console.log('close');
    this.modalService.dismissAll();
  }

  logout() {
    this.authenticationService.logout();
    this.profile = null;
    this.router.navigate(['/login']);
  }
}
