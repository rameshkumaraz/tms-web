import { Component, OnInit, Input } from '@angular/core';
import { faEllipsisH, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-merchant-card',
  templateUrl: './merchant-card.component.html',
  styleUrls: ['./merchant-card.component.scss']
})
export class MerchantCardComponent implements OnInit {

  @Input() merchants: Array<any>;

  faEllipsisH = faEllipsisH;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleAeccessIcon(id: number){

    for (const merchant of this.merchants){
        if (merchant.id === id){
          merchant.viewApin = merchant.viewApin === true ? false : true;
        }
    }
  }

  onToggleLoginIcon(id: number){
    for (const merchant of this.merchants){
      if (merchant.id === id){
        merchant.viewLpin = merchant.viewLpin === true ? false : true;
      }
    }
  }

}
