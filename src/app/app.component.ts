import { Component, HostListener, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Subject} from 'rxjs';
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
  userInactiveSub: Subject<any> = new Subject();

  refreshToken;

  constructor(public router: Router, public injector: Injector,
    public authService: AuthenticationService) {

    console.log(environment.title + ":" + environment.apiURL);

    AppInjector.setInjector(injector);

    this.setTimeout();

    this.authService.currentUser.subscribe(data => {
      console.log('User subscription....', data);
      if (data) {
        // this.setTimeout();
        // this.setRefreshInterval();
        //console.log('User signed in....'); 
        this.userInactiveSub.subscribe(() => {
          console.log('user has been inactive for 60 mins');
          this.logout();
          //   if (!this.modalRef) {
          //     this.modalRef = this.modalService.open(UserInactiveComponent, 'md', "User Inactive Alert");
          //     this.modalRef.componentInstance.action.subscribe(action => this.closeInactiveModel(action));
          //   }
        });

        this.setRefreshInterval();
      } else {
        // if(this.userInactive) this.userInactive.unsubscribe();
        // if(this.refreshTokenSub) this.refreshTokenSub.unsubscribe();
        //console.log('User signed out...');  
        //console.log('Interval id for clear ', this.refreshToken);
        clearInterval(this.refreshToken);
        // if(this.userInactiveSub)
        //   this.userInactiveSub.unsubscribe();
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
    this.userActivity = setTimeout(() => this.userInactiveSub.next(undefined), (15 * 60 * 1000)); 
  }

  setRefreshInterval() {
    this.refreshToken = setInterval(() => {
      this.refreshUserToken(); 
    }, (15 * 60 * 1000));
    console.log('Interval id ', this.refreshToken);
  }

  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }

  refreshUserToken() {
    console.log('Refresh user token....');
  }

  logout() {
    clearTimeout(this.userActivity);
    //console.log('Interval id for clear ', this.refreshToken);
    clearInterval(this.refreshToken);
    this.userInactiveSub.unsubscribe();
    this.authService.logout();
    this.router.navigate(['/logout']);
      // .then(() => {
      //   window.location.reload();
      // });
  }
}
