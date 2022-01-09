import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from '../shared/service/app.service';
import menuAccess from '../../assets/config/menu-access.json';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  pageHeader: string;

  constructor(private appService: AppService,
    private spinner: NgxSpinnerService,
    private router: Router) { }

  ngOnInit(): void {
    this.pageHeader = 'Dashboard';

    this.appService.clearMerchant();
    // this.resetMenuAccess();
  }

  resetMenuAccess(){
    Object.keys(menuAccess).forEach(function (key) {
      menuAccess[key] = false;
    });
  }

}
