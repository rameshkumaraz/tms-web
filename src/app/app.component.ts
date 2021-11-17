import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'azPayConfigurator';

  showHeader = false;
  showFooter = false;
  showSidebar = false;

  constructor(public router: Router) {
    router.events.subscribe((res: any) => {
      if (
        router.url === '/login' ||
        router.url.indexOf('/login') === 0 ||
        router.url === '/reset-password' ||
        router.url === '/forgotPass' ||
        router.url === '/error'
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

}
