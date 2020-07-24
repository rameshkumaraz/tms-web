import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-merchant-form',
  templateUrl: './merchant-form.component.html',
  styleUrls: ['./merchant-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MerchantFormComponent implements OnInit {

  faCheck = faCheck;

  pageHeader = 'New Merchant';

  constructor() { }

  ngOnInit(): void {
  }

}
