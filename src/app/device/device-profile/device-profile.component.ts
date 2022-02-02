import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/shared/core/base.component';

@Component({
  selector: 'app-device-profile',
  templateUrl: './device-profile.component.html',
  styleUrls: ['./device-profile.component.scss']
})
export class DeviceProfileComponent extends BaseComponent {

  pageHeader = 'Device Profile';

  constructor(private route: ActivatedRoute) {
    super(null);
   }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { order: "popular" }
      });
  }

  onPageLoad() {
    throw new Error('Method not implemented.');
  }

}
