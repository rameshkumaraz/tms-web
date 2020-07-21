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

  constructor(public router: Router) {
    router.events.subscribe((res: any) => {
      if (
        router.url === '/login' ||
        router.url.indexOf('/login') === 0 ||
        router.url === '/reset-password' ||
        router.url === '/forgotPass' ||
        router.url === '/l3config'
      ) {
        this.showHeader = false;
        this.showFooter = false;
      } else {
        this.showHeader = true;
        this.showFooter = true;
      }
    });
  }

}
