import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-device-profile',
  templateUrl: './device-profile.component.html',
  styleUrls: ['./device-profile.component.scss']
})
export class DeviceProfileComponent implements OnInit {

  pageHeader = 'Device Profile';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { order: "popular" }
      });
  }

}
