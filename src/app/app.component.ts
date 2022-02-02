import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './../environments/environment';

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

  constructor(public router: Router) {

    console.log(environment.title+":"+environment.apiURL);

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
