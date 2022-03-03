import { Component, HostListener, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from './../environments/environment';
import { AppInjector } from './shared/core/app-injector';
import { AuthenticationService } from './auth/services/authentication.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = environment.title;

  showHeader = false;
  showFooter = false;
  showSidebar = false;

  userActivity;
  userInactive: Subject<any> = new Subject();

  uActivity;

  constructor(public router: Router, public injector: Injector,
    public authService: AuthenticationService) {

    console.log(environment.title + ":" + environment.apiURL);

    AppInjector.setInjector(injector);

    this.setTimeout();

    this.authService.currentUser.subscribe(data => {
      console.log('User subscription....', data);
      if (data) {
        this.uActivity = this.userInactive.subscribe(() => {
          console.log('user has been inactive for 30s');
          this.closeInactiveModel();
          //   if (!this.modalRef) {
          //     this.modalRef = this.modalService.open(UserInactiveComponent, 'md', "User Inactive Alert");
          //     this.modalRef.componentInstance.action.subscribe(action => this.closeInactiveModel(action));
          //   }
        });
      } else {
        if (this.uActivity)
          this.uActivity.unsubscribe();
      }
    });

    router.events.subscribe((res: any) => {
      if (
        router.url === '/login' ||
        router.url.indexOf('/login') === 0 ||
        router.url === '/reset-password' ||
        router.url === '/forgotPass' ||
        router.url === '/error' ||
        router.url === '/logout'
      ) {
        this.showHeader = false;
        this.showFooter = false;
        this.showSidebar = false;
      } else {
        this.showHeader = true;
        this.showFooter = true;
        this.showFooter = true;
      }
    });
  }

  setTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), 30000);
  }

  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }

  closeInactiveModel() {
    this.authService.logout();
    this.router.navigate(['/logout'])
      .then(() => {
        window.location.reload();
      });
  }
}
