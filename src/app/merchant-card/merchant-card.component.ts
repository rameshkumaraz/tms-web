import { Component, OnInit, Input } from '@angular/core';
import { Merchant } from '../model/merchant';
import { faEllipsisH, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { MerchantView } from '../model/view/merchantView';

@Component({
  selector: 'app-merchant-card',
  templateUrl: './merchant-card.component.html',
  styleUrls: ['./merchant-card.component.scss']
})
export class MerchantCardComponent implements OnInit {

  @Input() merchants: Array<MerchantView>;

  faEllipsisH = faEllipsisH;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleAeccessIcon(id: number){

    for (let merchantView of this.merchants){
        if (merchantView.merchant.id === id){
          merchantView.aPinStatus = merchantView.aPinStatus === true ? false : true;
        }
    }

    for (let merchantView of this.merchants){
      if (merchantView.merchant.id === id){
        console.log(merchantView);
      }
    }
  }

  onToggleLoginIcon(id: number){
    for (let merchantView of this.merchants){
      if (merchantView.merchant.id === id){
        merchantView.lPinStatus = merchantView.lPinStatus === true ? false : true;
      }
    }
  }

}
