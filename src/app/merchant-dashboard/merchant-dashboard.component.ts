import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-merchant-dashboard',
  templateUrl: './merchant-dashboard.component.html',
  styleUrls: ['./merchant-dashboard.component.scss']
})
export class MerchantDashboardComponent implements OnInit {

  pageHeader: string;

  constructor() { }

  ngOnInit(): void {
    this.pageHeader = 'Merchant Dashboard';
  }

}
